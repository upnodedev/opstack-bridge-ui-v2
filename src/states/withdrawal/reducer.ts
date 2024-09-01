import { useL1PublicClient } from '@/hooks/useL1PublicClient';
import { useL2PublicClient } from '@/hooks/useL2PublicClient';
import ENV from '@/utils/ENV';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { extractWithdrawalMessageLogs, getWithdrawals } from 'viem/op-stack';

type statusWithdrawal =
  | 'waiting-to-prove'
  | 'ready-to-prove'
  | 'waiting-to-finalize'
  | 'ready-to-finalize'
  | 'finalized'
  | 'success'
  | 'reverted'
  | undefined
  | 'unknown'
  | ''
  | 'pending';

export interface EventWithdrawalItem {
  transactionhash: AddressType;
  sender: string;
  receiver: string;
  amount: string;
  iseth: boolean;
  extradata: string;
  remotetoken: string;
  localtoken: string;
  blocknumber: number;
  addresscontract: string;
  version: string;
}

export interface EventWithdrawal extends EventWithdrawalItem {
  timestamp: number;
  status: statusWithdrawal;
}

interface DepositState {
  items: EventWithdrawal[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DepositState = {
  items: [],
  totalItems: 0,
  totalPages: 0,
  currentPage: 1,
  status: 'idle',
  error: null,
};

// Async thunk to fetch withdrawals with pagination and filters
export const fetchWithdraws = createAsyncThunk(
  'withdrawal/fetchWithdrawals',
  async (params: {
    page: number;
    limit: number;
    sender?: string;
    receiver?: string;
  }) => {
    const { page, limit, sender, receiver } = params;

    const queryParams = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (!sender && !receiver) {
      return {
        items: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
      };
    }

    if (sender) queryParams.append('sender', sender);
    if (receiver) queryParams.append('receiver', receiver);
    const { l2PublicClient } = useL2PublicClient();
    const { l1PublicClient } = useL1PublicClient();

    const response = await axios.get(
      `${ENV.API_ENDPOINT}/withdrawal?${queryParams.toString()}`
    );

    const items = await Promise.all<EventWithdrawal>(
      response.data.items.map(async (item: EventWithdrawalItem) => {
        let status: statusWithdrawal = 'pending';
        const receipt = await l2PublicClient
          .getTransactionReceipt({
            hash: item.transactionhash,
          })
          .catch((error) => {
            status = 'reverted';
          });

        const block = await l2PublicClient.getBlock({
          blockNumber: BigInt(item.blocknumber),
        });
        // console.log({block})
        const timestamp = block.timestamp * 1000n;

        if (receipt) {
          try {
            const withdrawalStatus = await l1PublicClient.getWithdrawalStatus({
              receipt,
              targetChain: l2PublicClient.chain,
              chain: l1PublicClient.chain,
            });
            status = !receipt.transactionIndex ? 'reverted' : withdrawalStatus;
          } catch (error) {
            console.log({ error });
            status = 'reverted';
          }

          const logs = extractWithdrawalMessageLogs(receipt);
          const [withdrawal] = getWithdrawals(receipt);

          console.log(item.transactionhash, { logs, withdrawal });
        }

        return {
          ...item,
          timestamp: Number(timestamp),
          status,
        };
      })
    );

    return {
      ...response.data,
      items,
    };
  }
);

const withdrawalSlice = createSlice({
  name: 'withdrawal',
  initialState,
  reducers: {
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWithdraws.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchWithdraws.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchWithdraws.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch withdrawals';
      });
  },
});

export const { setCurrentPage } = withdrawalSlice.actions;

export default withdrawalSlice.reducer;

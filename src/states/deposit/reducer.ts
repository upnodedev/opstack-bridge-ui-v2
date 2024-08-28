// src/redux/depositSlice.ts
import { useL1PublicClient } from '@/hooks/useL1PublicClient';
import ENV from '@/utils/ENV';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  extractTransactionDepositedLogs,
  getL2TransactionHash,
} from 'viem/op-stack';

export interface EventDepositItem {
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

export interface EventDeposit extends EventDepositItem {
  timestamp: number;
  l2TxHash: string;
}

interface DepositState {
  items: EventDeposit[];
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

// Async thunk to fetch deposits with pagination and filters
export const fetchDeposits = createAsyncThunk(
  'deposit/fetchDeposit',
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

    if (sender) queryParams.append('sender', sender);
    if (receiver) queryParams.append('receiver', receiver);
    const { l1PublicClient } = useL1PublicClient();

    const response = await axios.get(
      `${ENV.API_ENDPOINT}/deposit?${queryParams.toString()}`
    );

    const items = await Promise.all(
      response.data.items.map(async (item: EventDepositItem) => {
        const receipt = await l1PublicClient.getTransactionReceipt({
          hash: item.transactionhash,
        });

        // get Timestamp
        const block = await l1PublicClient.getBlock({
          blockNumber: BigInt(item.blocknumber),
        });
        // console.log({block})
        const timestamp = block.timestamp;

        // get l2 tx
        const [log] = extractTransactionDepositedLogs(receipt);
        const l2Hash = getL2TransactionHash({ log });

        return {
          ...item,
          timestamp: Number(timestamp),
          l2TxHash: l2Hash,
        };
      })
    );

    return {
      ...response.data,
      items,
    };
  }
);

const depositSlice = createSlice({
  name: 'deposit',
  initialState,
  reducers: {
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeposits.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDeposits.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchDeposits.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch deposits';
      });
  },
});

export const { setCurrentPage } = depositSlice.actions;

export default depositSlice.reducer;

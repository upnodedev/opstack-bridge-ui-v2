import { useL1PublicClient } from '@/hooks/useL1PublicClient';
import { useL2PublicClient } from '@/hooks/useL2PublicClient';
import ENV from '@/utils/ENV';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  extractTransactionDepositedLogs,
  getL2TransactionHash,
} from 'viem/op-stack';

type statusTransaction =
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

export interface Event {
  transactionHash: `0x${string}`;
  sender: string;
  receiver: string;
  amount: string;
  isEth: boolean;
  extraData: string;
  remoteToken: string;
  localToken: string;
  blockNumber: string;
  addressContract: string;
  version: string;
  transactionType: 'deposit' | 'withdrawal';
  prove?: Prove;
  finalize?: Prove;
}

interface Prove {
  transactionHash: `0x${string}`;
  blockNumber: string;
  createdAt: string;
}

export interface EventItems extends Event {
  timestamp: number;
  status: statusTransaction;
}

interface TransactionType {
  withdrawalNeed: withdrawalType[];
  depositNeed: depositType[];
  withdrawalTransaction: withdrawalType[];
  depositTransaction: depositType[];
  inProgressCount: number;
  actionRequiredCount: number;
  totalCount: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export interface withdrawalType {
  transactionHash: `0x${string}`;
  l1Token: string;
  l2Token: string;
  from: string;
  to: string;
  amount: string;
  extraData: string;
  blockNumber: string;
  address: string;
  prove?: Prove;
  finalize?: Prove;
  timestamp: number;
  status: statusTransaction;
}

export interface depositType {
  transactionHash: `0x${string}`;
  from: string;
  to: string;
  amount: string;
  isEth: boolean;
  extraData: string;
  remoteToken: string;
  localToken: string;
  blockNumber: string;
  addressContract: string;
  version: string;
  timestamp: number;
  status: statusTransaction;
  l2TxHash: string;
}

const initialState: TransactionType = {
  withdrawalNeed: [],
  depositNeed: [],
  withdrawalTransaction: [],
  depositTransaction: [],
  inProgressCount: 0,
  actionRequiredCount: 0,
  totalCount: 0,
  status: 'idle',
  error: null,
};

// Async thunk to fetch Transactions
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (params: { address: `0x${string}` }) => {
    const { address } = params;

    const queryParams = new URLSearchParams({
      address,
    });

    const { l2PublicClient } = useL2PublicClient();
    const { l1PublicClient } = useL1PublicClient();

    const response = await axios.get(
      `${ENV.API_ENDPOINT}/transactions?${queryParams.toString()}`
    );

    const withdrawalNeed: withdrawalType[] = [];
    const depositNeed: depositType[] = [];

    const withdrawalTransaction: withdrawalType[] = [];
    const depositTransaction: depositType[] = [];

    let inProgressCount = 0;
    let actionRequiredCount = 0;

    // write for const transaction of response.data.transactions

    for (const item of response.data.transactions) {
      if (item.transactionType === 'withdrawal') {
        let status: statusTransaction = 'pending';
        const receipt = await l2PublicClient
          .getTransactionReceipt({
            hash: item.transactionHash,
          })
          .catch(() => {
            status = 'reverted';
          });

        const block = await l2PublicClient.getBlock({
          blockNumber: BigInt(item.blockNumber),
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
        }

        const tx = {
          transactionHash: item.transactionHash,
          l1Token: item.remoteToken,
          l2Token: item.localToken,
          from: item.sender,
          to: item.receiver,
          amount: item.amount,
          extraData: item.extraData,
          blockNumber: item.blockNumber,
          address: item.addressContract,
          prove: item.prove,
          finalize: item.finalize,
          timestamp: Number(timestamp),
          status,
        };

        if (tx.status !== 'finalized') {
          withdrawalNeed.push(tx);
          actionRequiredCount++;
        } else {
          withdrawalTransaction.push(tx);
        }
      } else {
        let status: statusTransaction = 'pending';
        let l2TxHash = '';
        const receipt = await l1PublicClient
          .getTransactionReceipt({
            hash: item.transactionHash,
          })
          .catch(() => {
            status = 'reverted';
          });

        const block = await l1PublicClient.getBlock({
          blockNumber: BigInt(item.blockNumber),
        });
        // console.log({block})
        const timestamp = block.timestamp * 1000n;

        if (receipt) {
          const [log] = extractTransactionDepositedLogs(receipt);
          const l2Hash = getL2TransactionHash({ log });
          if (l2Hash) {
            l2TxHash = l2Hash;
            status = 'success';
          }
        }
        const tx = {
          transactionHash: item.transactionHash,
          from: item.sender,
          to: item.receiver,
          amount: item.amount,
          isEth: item.isEth,
          extraData: item.extraData,
          remoteToken: item.remoteToken,
          localToken: item.localToken,
          blockNumber: item.blockNumber,
          addressContract: item.addressContract,
          version: item.version,
          timestamp: Number(timestamp),
          status,
          l2TxHash,
        };

        if (!tx.l2TxHash || tx.status === 'pending') {
          depositNeed.push(tx);
          inProgressCount++;
        } else {
          depositTransaction.push(tx);
        }
      }
    }

    withdrawalNeed.sort((a, b) => b.timestamp - a.timestamp);
    depositNeed.sort((a, b) => b.timestamp - a.timestamp);
    withdrawalTransaction.sort((a, b) => b.timestamp - a.timestamp);
    depositTransaction.sort((a, b) => b.timestamp - a.timestamp);

    return {
      withdrawalNeed,
      depositNeed,
      withdrawalTransaction,
      depositTransaction,
      inProgressCount,
      actionRequiredCount,
      totalCount: +response.data.totalCount,
    };
  }
);

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    resetTransaction: (state) => {
      state.withdrawalNeed = [];
      state.depositNeed = [];
      state.withdrawalTransaction = [];
      state.depositTransaction = [];
      state.inProgressCount = 0;
      state.actionRequiredCount = 0;
      state.totalCount = 0;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.totalCount = action.payload.totalCount;
        state.inProgressCount = action.payload.inProgressCount;
        state.actionRequiredCount = action.payload.actionRequiredCount;

        state.withdrawalNeed = [...action.payload.withdrawalNeed];
        state.depositNeed = [...action.payload.depositNeed];
        state.withdrawalTransaction = [...action.payload.withdrawalTransaction];
        state.depositTransaction = [...action.payload.depositTransaction];
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch transactions';
      });
  },
});

export const { resetTransaction } = transactionSlice.actions;

export default transactionSlice.reducer;

import { useL1PublicClient } from '@/hooks/useL1PublicClient';
import { useL2PublicClient } from '@/hooks/useL2PublicClient';
import ENV from '@/utils/ENV';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  extractTransactionDepositedLogs,
  getL2TransactionHash,
  getWithdrawals,
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
  blockTimestamp: string;
  l2TransactionHash: string;
}

interface Prove {
  transactionHash: `0x${string}`;
  blockNumber: string;
  createdAt: string;
  blockTimestamp: string;
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

  proveCompleteAt?: number;
  finalizeCompleteAt?: number;
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

    let actionRequiredCount = 0;

    // write for const transaction of response.data.transactions
    const l2BlockNumber = await l2PublicClient.getBlockNumber();

    for (const item of response.data.transactions as Event[]) {
      if (item.transactionType === 'withdrawal') {
        let status: statusTransaction = 'pending';
        let proveCompleteAt: number | undefined = undefined;
        let finalizeCompleteAt: number | undefined = undefined;
        const STATE_ROOT_PERIOD = ENV.STATE_ROOT_PERIOD * 1000;
        const PROVE_PERIOD = ENV.WITHDRAWAL_PERIOD * 1000;

        // console.log({ prove: item.prove, finalize: item.finalize });

        if (!item.prove && !item.finalize) {
          // check if the transaction is waiting to prove
          const currentTimestamp = new Date().getTime() / 1000;
          let blockTimestamp = Number(item.blockTimestamp) + STATE_ROOT_PERIOD;
          // console.log({ currentTimestamp, blockTimestamp });

          try {
            const { timestamp } = await l1PublicClient.getTimeToNextGame({
              l2BlockNumber,
              targetChain: l2PublicClient.chain,
              chain: undefined,
            });
            if (timestamp) {
              blockTimestamp = timestamp;
            }
          } catch (_) {
            try {
              const { timestamp } = await l1PublicClient.getTimeToNextL2Output({
                l2BlockNumber,
                targetChain: l2PublicClient.chain,
                chain: undefined,
              });
              if (timestamp) {
                blockTimestamp = timestamp;
              }
            } catch (_) {
              /* empty */
            }
          }

          if (currentTimestamp > blockTimestamp) {
            status = 'ready-to-prove';
          } else {
            status = 'waiting-to-prove';
            proveCompleteAt = blockTimestamp;
          }
        }
        if (item.prove && !item.finalize) {
          // check if the transaction is waiting to finalize
          const currentTimestamp = new Date().getTime()  / 1000;
          let blockTimestamp = Number(item.prove.blockTimestamp) + PROVE_PERIOD;

          const receipt = await l2PublicClient.getTransactionReceipt({
            hash: item.transactionHash,
          });
          const [message] = getWithdrawals(receipt);

          try {
            const { timestamp } = await l1PublicClient.getTimeToFinalize({
              withdrawalHash: message.withdrawalHash,
              targetChain: l2PublicClient.chain,
              chain: undefined,
            });
            if (timestamp) {
              blockTimestamp = timestamp;
            }
          } catch (error) {
            /* empty */
          }

          if (currentTimestamp > blockTimestamp) {
            status = 'ready-to-finalize';
          } else {
            finalizeCompleteAt = blockTimestamp;
            status = 'waiting-to-finalize';
          }
        }
        if (item.prove && item.finalize) {
          status = 'finalized';
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
          timestamp: Number(item.blockTimestamp),
          status,
          proveCompleteAt,
          finalizeCompleteAt,
        };

        if (tx.status !== 'finalized') {
          withdrawalNeed.push(tx);
          actionRequiredCount++;
        } else {
          withdrawalTransaction.push(tx);
        }
      } else {
        const status: statusTransaction = 'success';
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
          timestamp: Number(item.blockTimestamp),
          status,
          l2TxHash: item.l2TransactionHash,
        };

        depositTransaction.push(tx);
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

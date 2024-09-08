import BoxContainer from '@/components/Box/BoxContainer';
import TransactionItemDeposit from '@/components/Transaction/TransactionItemDeposit';
import TransactionWithdrawal from '@/components/Transaction/TransactionWithdrawal';
import { useAppDispatch, useAppSelector } from '@/states/hooks';
import { fetchTransactions, resetTransaction } from '@/states/transactions/reducer';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Chain } from 'viem';
import { useAccount } from 'wagmi';

interface Props extends SimpleComponent {
  l1: Chain;
  l2: Chain;
  onClickDetail: (txHash: `0x${string}`) => void;
}

const TransactionWrapper = styled.div``;

function Transaction({ l1, l2, onClickDetail }: Props) {
  const dispatch = useAppDispatch();
  const { address, isConnected } = useAccount();
  const [selectedTab, setSelectedTab] = useState(1);
  const refresh = useAppSelector((state) => state.refresh.counter);

  const [type, setType] = useState<'withdrawal' | 'deposit'>('deposit');

  useEffect(() => {
    if (address && isConnected) {
      dispatch(fetchTransactions({ address }));
    }else{
      dispatch(resetTransaction());
    }
  }, [dispatch, address, refresh, isConnected]);

  const transaction = useAppSelector((state) => state.transactions);

  const ItemContainter = () => {
    if (selectedTab === 1) {
      return transaction.withdrawalNeed.map((item) => (
        <TransactionWithdrawal
          onClickDetail={onClickDetail}
          key={item.transactionHash}
          data={item}
          l1={l1}
          l2={l2}
        />
      ));
    }
    if (selectedTab === 2 && type === 'withdrawal') {
      return transaction.withdrawalTransaction.map((item) => (
        <TransactionWithdrawal
          onClickDetail={onClickDetail}
          key={item.transactionHash}
          data={item}
          l1={l1}
          l2={l2}
        />
      ));
    }
    return transaction.depositTransaction.map((item) => (
      <TransactionItemDeposit key={item.transactionHash} data={item} l1={l1} l2={l2} />
    ));
  };

  return (
    <TransactionWrapper>
      <BoxContainer hasExit={true}>
        <div className="text-gray-900 font-semibold text-lg">Activity</div>
        <div className="mt-5 flex">
          <div
            className={`w-1/2 text-center pb-2 border-b border-gray-300 text-gray-500 cursor-pointer 
                ${
                  selectedTab === 1 && 'border-b-2 border-primary text-primary'
                }`}
            onClick={() => {
              setSelectedTab(1);
            }}
          >
            <div className="flex gap-4 justify-center items-center">
              <div className="font-semibold text-lg">Action needed</div>
              {transaction.withdrawalNeed.length > 0 && (
                <div className="flex justify-center items-center border border-[#BDDBFF] w-6 h-[22px] bg-[#EEF6FF] rounded-full text-primary">
                  {transaction.withdrawalNeed.length}
                </div>
              )}
            </div>
          </div>
          <div
            className={`w-1/2 text-center pb-2 border-b border-gray-300 text-gray-500 cursor-pointer 
              ${selectedTab === 2 && 'border-b-2 border-primary text-primary'}`}
            onClick={() => {
              setSelectedTab(2);
            }}
          >
            <div className="font-semibold">History</div>
          </div>
        </div>

        {selectedTab === 2 && (
          <div className="w-full grid grid-cols-2 gap-4 mt-4">
            <div
              className={`cursor-pointer font-semibold text-lg text-center py-1 rounded-md hover:bg-gray-300 hover:text-gray-800 ${
                type === 'deposit'
                  ? 'bg-gray-300 text-gray-800'
                  : 'bg-white text-gray-600'
              }`}
              onClick={() => setType('deposit')}
            >
              Deposit
            </div>

            <div
              className={`cursor-pointer font-semibold text-lg text-center py-1 rounded-md hover:bg-gray-300 hover:text-gray-800 ${
                type === 'withdrawal'
                  ? 'bg-gray-300 text-gray-800'
                  : 'bg-white text-gray-600'
              }`}
              onClick={() => setType('withdrawal')}
            >
              Withdrawal
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4 mt-4 h-[30rem] overflow-scroll">
          {ItemContainter()}
        </div>
      </BoxContainer>
    </TransactionWrapper>
  );
}

export default Transaction;

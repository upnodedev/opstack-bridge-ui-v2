import styled from 'styled-components';
import { default as ETH } from '@/assets/eth.svg';
import CircleArrowDown from '@/assets/circle-arrow-down.svg';
import DetailIMG from '@/assets/detail.svg';
import { openPage } from '@/states/layout/reducer';
import { useAppDispatch, useAppSelector } from '@/states/hooks';
import { Chain, formatUnits } from 'viem';
import { withdrawalType } from '@/states/transactions/reducer';
import { StatusBadge } from './StatusBadge';
import { useEffect, useState } from 'react';
import { useUsdtPrice } from '@/contexts/UsdtPriceContext';
import { formatSecsString } from '@/utils';
import ENV from '@/utils/ENV';

interface Props extends SimpleComponent {
  l1: Chain;
  l2: Chain;
  data: withdrawalType;
  onClickDetail: (txHash: `0x${string}`) => void;
}

const TransactionWithdrawalWrapper = styled.div``;

function TransactionWithdrawal({ l1, l2, data, onClickDetail }: Props) {
  const amount = formatUnits(BigInt(data.amount || 0), l2.nativeCurrency.decimals);
  const refresh = useAppSelector((state) => state.refresh.counter);
  const usdtPrice = useUsdtPrice(l1.nativeCurrency.symbol);

  const getAmountUsdt = (+amount * (usdtPrice || 0)).toFixed(2);

  const L1NetworkExplorerUrl = l1.blockExplorers?.default.url;
  const L2NetworkExplorerUrl = l2.blockExplorers?.default.url;

  const timeLocale = new Date(Number(data.timestamp)).toLocaleString();

  const [timePassed, setTimePassed] = useState('');

  const timePassedInterval = () => {
    const currentTime = new Date().getTime();
    const timePassed = currentTime - Number(data.timestamp);
    setTimePassed(formatSecsString(timePassed / 1000));
  };

  useEffect(() => {
    timePassedInterval();
  }, [refresh]);

  return (
    <TransactionWithdrawalWrapper>
      <div>
        <div className="rounded-xl bg-[#F9FAFB] border border-[#E4E7EC] p-3">
          <div className="flex justify-between">
            <div className="flex gap-2">
              <div className="relative">
                <div className="w-[42px] h-[42px] rounded-full border border-[#EAECF0] bg-white"></div>
                <img
                  src={ETH}
                  alt=""
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                />
                <img
                  src={CircleArrowDown}
                  className="w-4 absolute bottom-0 right-0"
                  alt=""
                />
              </div>
              <div>
                <div className="text-gray-900 text-sm font-semibold">
                  Withdraw
                </div>
                <div className="text-gray-500 text-xs mt-1.5">
                  {timeLocale} ({timePassed} ago)
                </div>
              </div>
            </div>
            <div>
              <StatusBadge status={data.status} />
            </div>
          </div>
          <div className="mt-2 flex justify-between items-center">
            <div>
              <div className="text-gray-900 font-semibold text-sm">
                {amount} {l2.nativeCurrency.symbol}
              </div>
              <div className="text-gray-500 font-normal text-xs">
                $ {getAmountUsdt}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="relative">
                <div className="w-5 h-5 rounded-full border border-[#EAECF0] bg-white"></div>
                <img
                  src={ENV.L2_LOGO_URL}
                  alt=""
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-3"
                />
              </div>
              <div className="text-gray-500 text-xs font-semibold">
                {ENV.L2_CHAIN_NAME}
              </div>
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M7.5 15L12.5 10L7.5 5"
                    stroke="#1E61F2"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="relative">
                <div className="w-5 h-5 rounded-full border border-[#EAECF0] bg-white"></div>
                <img
                  src={ENV.L1_LOGO_URL}
                  alt=""
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-3"
                />
              </div>
              <div className="text-gray-500 text-xs font-semibold">
                {ENV.L1_CHAIN_NAME}
              </div>
            </div>
          </div>
          <div className="my-3 border border-[#E4E7EC] border-dashed" />
          <div className="flex justify-between items-center">
            <div
              className="flex gap-1.5 hover:opacity-50"
              onClick={() => {
                onClickDetail(data.transactionHash);
              }}
            >
              <img src={DetailIMG} alt="" className="w-5 h-5" />
              <div className="text-primary text-sm font-semibold cursor-pointer">
                Detail
              </div>
            </div>
            {data?.status === 'ready-to-prove' && (
              <button
                onClick={() => {
                  onClickDetail(data.transactionHash);
                }}
                className="mt-8 py-2 px-3 rounded-full text-sm bg-primary text-white font-semibold"
              >
                Prove
              </button>
            )}
            {data?.status === 'ready-to-finalize' && (
              <button
                onClick={() => {
                  onClickDetail(data.transactionHash);
                }}
                className="mt-8 py-2 px-3 rounded-full text-sm bg-primary text-white font-semibold"
              >
                Finalize
              </button>
            )}
          </div>
        </div>
      </div>
    </TransactionWithdrawalWrapper>
  );
}

export default TransactionWithdrawal;

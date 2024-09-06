import ChevronDown from '@/assets/chevron-down.svg';
import CircleArrowDown from '@/assets/circle-arrow-down.svg';
import { default as ETH } from '@/assets/eth.svg';
import { useUsdtPrice } from '@/contexts/UsdtPriceContext';
import { useAppSelector } from '@/states/hooks';
import { depositType } from '@/states/transactions/reducer';
import { formatSecsString } from '@/utils';
import ENV from '@/utils/ENV';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Chain, formatUnits } from 'viem';

interface Props extends SimpleComponent {
  l1: Chain;
  l2: Chain;
  data: depositType;
}

const TransactionItemWrapper = styled.div``;

function TransactionItemDeposit({ l1, l2, data }: Props) {
  const amount = formatUnits(BigInt(data.amount), l1.nativeCurrency.decimals);
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

  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    timePassedInterval();
  }, [refresh]);

  return (
    <TransactionItemWrapper>
      <div
        className="rounded-xl bg-[#F9FAFB] border border-[#E4E7EC] p-3"
        onClick={toggleAccordion}
      >
        <div>
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
                  Deposit
                </div>
                <div className="text-gray-500 text-xs mt-1.5">
                  {timeLocale} ({timePassed} ago)
                </div>
              </div>
            </div>
            <div>
              <img
                src={ChevronDown}
                alt=""
                className={isOpen ? 'rotate-180' : ''}
              />
            </div>
          </div>
          <div className="mt-2 flex justify-between items-center">
            <div>
              <div className="text-gray-900 font-semibold text-sm">
                {amount} {l1.nativeCurrency.symbol}
              </div>
              <div className="text-gray-500 font-normal text-xs">
                $ {getAmountUsdt}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <a
                className="flex gap-2 items-center"
                href={`${L1NetworkExplorerUrl}/tx/${data.transactionHash}`}
                target="_blank"
                rel="noreferrer noopener"
              >
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
              </a>
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
              <a
                className="flex gap-2 items-center"
                href={`${L2NetworkExplorerUrl}/tx/${data.l2TxHash}`}
                target="_blank"
                rel="noreferrer noopener"
              >
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
              </a>
            </div>
          </div>
        </div>
        <div
          ref={contentRef}
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-screen' : 'max-h-0'
          }`}
          style={{
            maxHeight:
              isOpen && contentRef.current
                ? (contentRef.current as any).scrollHeight
                : '0px',
          }}
        >
          <div>
            <hr className="border-[#E4E7EC] my-3" />
            <div className="flex gap-3 items-center">
              <div className="relative bg-white rounded-full border border-[#E4E7EC] shadow-sm w-9 h-9">
                <Icon
                  icon="lucide:wallet"
                  className="text-[#079455] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                />
              </div>
              <div>
                <div className="text-[#079455] text-sm font-semibold">
                  Deposited
                </div>
                <a
                  className="flex gap-2 items-center"
                  href={`${L1NetworkExplorerUrl}/tx/${data.transactionHash}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <div className="text-[#1E61F2] text-sm font-medium flex gap-1 items-center">
                    <div>Transaction</div>
                    <Icon icon="ci:external-link" className="w-4 h-4" />
                  </div>
                </a>
              </div>
            </div>
            <div className="border-l border-[#E4E7EC] h-3 translate-x-4" />
            <div className="flex gap-3 items-center">
              <div className="relative bg-white rounded-full border border-[#E4E7EC] shadow-sm w-9 h-9">
                <Icon
                  icon="lucide:check"
                  className="text-[#079455] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                />
              </div>
              <div>
                <div className="text-[#079455] text-sm font-semibold">
                  L2 confirmation
                </div>
                <a
                  className="flex gap-2 items-center"
                  href={`${L2NetworkExplorerUrl}/tx/${data.l2TxHash}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <div className="text-[#1E61F2] text-sm font-medium flex gap-1 items-center">
                    <div>Transaction</div>
                    <Icon icon="ci:external-link" className="w-4 h-4" />
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TransactionItemWrapper>
  );
}

export default TransactionItemDeposit;

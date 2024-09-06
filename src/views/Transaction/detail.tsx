import CircleArrowDown from '@/assets/circle-arrow-down.svg';
import { default as ETH } from '@/assets/eth.svg';
import BoxContainer from '@/components/Box/BoxContainer';

import { useAppDispatch } from '@/states/hooks';
import { Icon } from '@iconify/react/dist/iconify.js';
import styled from 'styled-components';
import { Chain } from 'viem';
import { useAccount } from 'wagmi';

interface Props extends SimpleComponent {
  l1: Chain;
  l2: Chain;
  txHash: `0x${string}` | undefined;
}

const TransactionDetailWrapper = styled.div``;

function TransactionDetail({ l1, l2 }: Props) {
  const dispatch = useAppDispatch();
  const { address } = useAccount();

  return (
    <TransactionDetailWrapper>
      <BoxContainer>
        <div className="text-gray-900 font-semibold text-lg">
          Transection Detail
        </div>
        <div className="mt-3">
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
                    3 May 2024 (8 hours 1 mins ago)
                  </div>
                </div>
              </div>
              <div>
                <div className="flex gap-1 items-center rounded-full bg-yellow-50 border border-yellow-200 pl-2 py-.5 pr-1">
                  <div className="text-yellow-700 font-semibold text-xs">
                    Finalize
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path
                      d="M2.5 6H9.5M9.5 6L6 2.5M9.5 6L6 9.5"
                      stroke="#F79009"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <div>
                <div className="text-gray-900 font-semibold text-sm">
                  2,211.21 ETH
                </div>
                <div className="text-gray-500 font-normal text-xs">
                  $2,867,338.71
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <div className="relative">
                  <div className="w-5 h-5 rounded-full border border-[#EAECF0] bg-white"></div>
                  <img
                    src={ETH}
                    alt=""
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-3"
                  />
                </div>
                <div className="text-gray-500 text-xs font-semibold">
                  Ethereum
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
                    src={ETH}
                    alt=""
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-3"
                  />
                </div>
                <div className="text-gray-500 text-xs font-semibold">
                  Optimism
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="my-3">
          <div className="flex gap-3 items-center">
            <div className="relative bg-white rounded-full border border-[#E4E7EC] shadow-sm w-9 h-9">
              <Icon
                icon="lucide:send"
                className="text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            </div>
            <div>
              <div className="text-blue-600 text-sm font-semibold">
                Deposited
              </div>
              <div className="text-[#667085] text-sm font-medium flex gap-1 items-center">
                <div>Fee est: $0.00</div>
              </div>
            </div>
          </div>
          <div className="border-l border-[#E4E7EC] h-3 translate-x-4 my-1" />
          <div className="flex gap-3 items-center">
            <div className="relative bg-white rounded-full border border-[#E4E7EC] shadow-sm w-9 h-9">
              <Icon
                icon="lucide:timer"
                className="text-[#98A2B3] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            </div>
            <div>
              <div className="text-[#667085] text-sm font-semibold">
                L2 confirmation
              </div>
              <div className="text-[#1E61F2] text-sm font-medium flex gap-1 items-center">
                <div>Learn more</div>
                <Icon icon="ci:external-link" className="w-4 h-4" />
              </div>
            </div>
          </div>
          <div className="border-l border-[#E4E7EC] h-3 translate-x-4 my-1" />
          <div className="flex gap-3 items-center">
            <div className="relative bg-white rounded-full border border-[#E4E7EC] shadow-sm w-9 h-9">
              <Icon
                icon="mingcute:loading-3-line"
                className="text-[#1E61F2] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            </div>
            <div>
              <div className="text-[#1E61F2] text-sm font-semibold">
                Prove withdrawal
              </div>
              <div className="text-[#667085] text-sm font-medium flex gap-1 items-center">
                <div>Fee est: $15.00</div>
              </div>
            </div>
          </div>
          <div className="border-l border-[#E4E7EC] h-3 translate-x-4 my-1" />
          <div className="flex gap-3 items-center">
            <div className="relative bg-white rounded-full border border-[#E4E7EC] shadow-sm w-9 h-9">
              <Icon
                icon="lucide:calendar"
                className="text-[#079455] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            </div>
            <div>
              <div className="text-[#079455] text-sm font-semibold">
                Wait 7 days
              </div>
              <div className="text-[#667085] text-sm font-medium flex gap-1 items-center">
                You can view it on the{' '}
                <span className="text-[#1E61F2]">Transaction explorer </span>
                page
              </div>
            </div>
          </div>
          <div className="border-l border-[#E4E7EC] h-3 translate-x-4 my-1" />
          <div className="flex gap-3 items-center">
            <div className="relative bg-white rounded-full border border-[#E4E7EC] shadow-sm w-9 h-9">
              <Icon
                icon="lucide:star"
                className="text-[#98A2B3] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            </div>
            <div>
              <div className="text-[#667085] text-sm font-semibold">
                Claim withdrawal
              </div>
              <div className="text-[#667085] text-sm font-medium flex gap-1 items-center">
                Fee est: $0.00
              </div>
            </div>
          </div>
        </div>
        <div className="border border-[#DA72E6] rounded-md bg-[#F9C3E02B] p-3 mb-3">
          <div className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#FA71CD] to-[#C471F5] flex gap-1.5 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M9.16667 3.33333H6.5C5.09987 3.33333 4.3998 3.33333 3.86502 3.60582C3.39462 3.8455 3.01217 4.22795 2.77248 4.69836C2.5 5.23314 2.5 5.9332 2.5 7.33333V11.6667C2.5 12.4416 2.5 12.8291 2.58519 13.147C2.81635 14.0098 3.49022 14.6836 4.35295 14.9148C4.67087 15 5.05836 15 5.83333 15V16.9463C5.83333 17.3903 5.83333 17.6123 5.92436 17.7263C6.00352 17.8255 6.12356 17.8832 6.25045 17.8831C6.39636 17.8829 6.56973 17.7442 6.91646 17.4668L8.90434 15.8765C9.31043 15.5517 9.51347 15.3892 9.73957 15.2737C9.94017 15.1712 10.1537 15.0963 10.3743 15.051C10.6231 15 10.8831 15 11.4031 15H12.6667C14.0668 15 14.7669 15 15.3016 14.7275C15.772 14.4878 16.1545 14.1054 16.3942 13.635C16.6667 13.1002 16.6667 12.4001 16.6667 11V10.8333M16.7678 3.23223C17.7441 4.20854 17.7441 5.79146 16.7678 6.76777C15.7915 7.74408 14.2085 7.74408 13.2322 6.76777C12.2559 5.79146 12.2559 4.20854 13.2322 3.23223C14.2085 2.25592 15.7915 2.25592 16.7678 3.23223Z"
                stroke="url(#paint0_linear_4596_486)"
                strokeWidth="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_4596_486"
                  x1="17.5"
                  y1="17.8831"
                  x2="17.5"
                  y2="2.5"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#FA71CD" />
                  <stop offset="1" stopColor="#C471F5" />
                </linearGradient>
              </defs>
            </svg>
            <div>Notify me if this transaction requires action</div>
          </div>
          <input
            type="text"
            className="py-2 px-3 w-full mt-2 rounded-full border border-[#D0D5DD]"
            placeholder="Enter your email"
          />
        </div>
        <div className="text-xs text-center text-[#667085]">
          You can safely close this modal and check back later
        </div>
        <div className="w-full text-end">
          <button className="mt-8 py-2 px-3 rounded-full text-sm bg-primary text-white font-semibold">
            Prove
          </button>
        </div>
      </BoxContainer>
    </TransactionDetailWrapper>
  );
}

export default TransactionDetail;

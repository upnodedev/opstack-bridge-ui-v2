import CircleArrowDown from "@/assets/circle-arrow-down.svg";
import Detail from "@/assets/detail.svg";
import { default as ETH } from "@/assets/eth.svg";
import BoxContainer from "@/components/Box/BoxContainer";
import TransactionItemDeposit from "@/components/Transaction/TransactionItemDeposit";
import { fetchDeposits } from "@/states/deposit/reducer";
import { useAppDispatch, useAppSelector } from "@/states/hooks";
import { openPage } from "@/states/layout/reducer";
import { fetchWithdraws } from "@/states/withdrawal/reducer";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Chain } from "viem";
import { useAccount } from "wagmi";

interface Props extends SimpleComponent {
  l1: Chain;
  l2: Chain;
}

const TransactionWrapper = styled.div``;

function Transaction({ l1, l2 }: Props) {
  const dispatch = useAppDispatch();
  const deposits = useAppSelector((state) => state.deposit);
  const withdrawals = useAppSelector((state) => state.withdrawal);
  const [isOpen, setIsOpen] = useState(false);
  const { address } = useAccount();
  const [selectedTab, setSelectedTab] = useState(2);
  useEffect(() => {
    dispatch(
      fetchDeposits({ page: 1, limit: 10, sender: address, receiver: address })
    );
    dispatch(
      fetchWithdraws({ page: 1, limit: 10, sender: address, receiver: address })
    );
  }, [dispatch, address]);

  const openTranactionDetail = () => {
    dispatch(openPage("transaction detail"));
  };

  return (
    <TransactionWrapper>
      <BoxContainer hasExit={true}>
        <div className="text-gray-900 font-semibold text-lg">Activity</div>
        <div className="mt-5 flex">
          <div
            className={`w-1/2 text-center pb-2 border-b border-gray-300 text-gray-500 cursor-pointer 
                ${
                  selectedTab === 1 && "border-b-2 border-primary text-primary"
                }`}
            onClick={() => {
              setSelectedTab(1);
            }}
          >
            <div className="flex gap-4 justify-center items-center">
              <div className="font-semibold text-lg">Action needed</div>
              <div className="flex justify-center items-center border border-[#BDDBFF] w-6 h-[22px] bg-[#EEF6FF] rounded-full text-primary">
                2
              </div>
            </div>
          </div>
          <div
            className={`w-1/2 text-center pb-2 border-b border-gray-300 text-gray-500 cursor-pointer 
              ${selectedTab === 2 && "border-b-2 border-primary text-primary"}`}
            onClick={() => {
              setSelectedTab(2);
            }}
          >
            <div className="font-semibold">History</div>
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-4 h-[30rem] overflow-scroll px-4">
          {selectedTab === 1 ? (
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
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
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
                          stroke-width="1.66667"
                          stroke-linecap="round"
                          stroke-linejoin="round"
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
                <div className="my-3 border border-[#E4E7EC] border-dashed" />
                <div className="flex justify-between items-center">
                  <div className="flex gap-1.5">
                    <img src={Detail} alt="" className="w-5 h-5" />
                    <div className="text-primary text-sm font-semibold">
                      Detail
                    </div>
                  </div>
                  <button
                    className="py-2 px-3 rounded-full text-sm bg-primary text-white font-semibold"
                    onClick={openTranactionDetail}
                  >
                    Prove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            deposits.items.map((item, index) => (
              <TransactionItemDeposit key={index} data={item} l1={l1} l2={l2} />
            ))
          )}
        </div>
      </BoxContainer>
    </TransactionWrapper>
  );
}

export default Transaction;

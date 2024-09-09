import CircleArrowDown from '@/assets/circle-arrow-down.svg';
import { default as ETH } from '@/assets/eth.svg';
import BoxContainer from '@/components/Box/BoxContainer';
import { StatusBadge } from '@/components/Transaction/StatusBadge';
import { useUsdtPrice } from '@/contexts/UsdtPriceContext';
import { useL1PublicClient } from '@/hooks/useL1PublicClient';
import { useL2PublicClient } from '@/hooks/useL2PublicClient';
import { useOPWagmiConfig } from '@/hooks/useOPWagmiConfig';
import { useSwitchNetworkDirection } from '@/hooks/useSwitchNetworkPair';

import { useAppDispatch, useAppSelector } from '@/states/hooks';
import {
  fetchTransactions,
  withdrawalType,
} from '@/states/transactions/reducer';
import { formatSecsString } from '@/utils';
import ENV from '@/utils/ENV';
import { Token } from '@/utils/opType';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Chain, formatUnits, TransactionReceipt } from 'viem';
import { getWithdrawals, walletActionsL1 } from 'viem/op-stack';
import { useAccount } from 'wagmi';
import { getWalletClient } from 'wagmi/actions';

interface Props extends SimpleComponent {
  l1: Chain;
  l2: Chain;
  txHash: `0x${string}` | undefined;
  selectedTokenPair: [Token, Token];
}

const TransactionDetailWrapper = styled.div``;

function StatusWithdrawal({
  status,
  transaction,
  icon,
  isLoading,
  link,
  iconClassName,
  textClassName,
  detailText,
}: {
  status: string;
  link?: string;
  transaction: withdrawalType;
  icon: string;
  isLoading?: boolean;
  textClassName?: string;
  iconClassName?: string;
  detailText?: React.ReactNode;
}) {
  if (!link) {
    return (
      <div className="flex gap-2 items-center">
        <div className="relative bg-white rounded-full border border-[#E4E7EC] shadow-sm w-9 h-9">
          <Icon
            icon={icon}
            className={`${iconClassName} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
          />
          {isLoading && (
            <Icon
              icon={'line-md:loading-twotone-loop'}
              className={`${iconClassName} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10`}
            />
          )}
        </div>
        <div>
          <div className={`${textClassName} text-sm font-semibold`}>
            {status}
          </div>
          {detailText}
        </div>
      </div>
    );
  }
  return (
    <a
      className="flex gap-2 items-center hover:opacity-80 relative"
      href={link}
      target="_blank"
      rel="noreferrer noopener"
    >
      <div className="relative bg-white rounded-full border border-[#E4E7EC] shadow-sm w-9 h-9">
        <Icon
          icon={icon}
          className="text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
        {isLoading && (
          <Icon
            icon={'line-md:loading-twotone-loop'}
            className="text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10"
          />
        )}
      </div>
      <div>
        <div className="text-blue-600 text-sm font-semibold">{status}</div>
      </div>
    </a>
  );
}

function TransactionDetail({ l1, l2, txHash, selectedTokenPair }: Props) {
  const dispatch = useAppDispatch();
  const { chain, address } = useAccount();
  const refresh = useAppSelector((state) => state.refresh.counter);
  const usdtPrice = useUsdtPrice(l1.nativeCurrency.symbol);

  const L1NetworkExplorerUrl = l1.blockExplorers?.default.url;
  const L2NetworkExplorerUrl = l2.blockExplorers?.default.url;

  const transaction = useAppSelector((state) => {
    const tx = state.transactions.withdrawalNeed.find(
      (item) => item.transactionHash === txHash
    );
    if (!tx) {
      return state.transactions.withdrawalTransaction.find(
        (item) => item.transactionHash === txHash
      );
    }
    return tx;
  });

  const timeLocale = new Date(
    Number(transaction!.timestamp)
  ).toLocaleDateString();

  const [timePassed, setTimePassed] = useState('');

  const timePassedInterval = () => {
    const currentTime = new Date().getTime();
    const timePassed = currentTime - Number(transaction!.timestamp);
    setTimePassed(formatSecsString(timePassed / 1000));
  };

  const amount = formatUnits(
    BigInt(transaction!.amount),
    l2.nativeCurrency.decimals
  );
  const getAmountUsdt = (+amount * (usdtPrice || 0)).toFixed(2);

  useEffect(() => {
    timePassedInterval();
  }, [refresh]);

  const [receipt, setReceipt] = useState<TransactionReceipt>();
  const { opConfig } = useOPWagmiConfig();

  const { l2PublicClient } = useL2PublicClient();
  const { l1PublicClient } = useL1PublicClient();

  const prove = async () => {
    if (!opConfig) return;
    if (!receipt) return;
    const L1walletClient = (
      await getWalletClient(opConfig, {
        chainId: l1PublicClient.chain.id,
      })
    ).extend(walletActionsL1());
    const { output, withdrawal } = await l1PublicClient.waitToProve({
      receipt: receipt,
      targetChain: l2PublicClient.chain,
      chain: undefined,
    });

    // 2. Build parameters to prove the withdrawal on the L2.
    const args = await l2PublicClient.buildProveWithdrawal({
      output,
      withdrawal,
      chain: l2PublicClient.chain,
    });

    // 3. Prove the withdrawal on the L1.
    const hash = await L1walletClient.proveWithdrawal(args);

    // 4. Wait until the prove withdrawal is processed.
    await l1PublicClient.waitForTransactionReceipt({
      hash,
    });

    dispatch(fetchTransactions({ address: address! }));
  };

  const finalize = async () => {
    if (!opConfig) return;
    if (!receipt) return;
    const L1walletClient = (
      await getWalletClient(opConfig, {
        chainId: l1PublicClient.chain.id,
      })
    ).extend(walletActionsL1());

    // (Shortcut) Get withdrawals from receipt in Step 3.
    const [withdrawal] = getWithdrawals({ logs: receipt.logs });

    // 1. Wait until the withdrawal is ready to finalize.
    await l1PublicClient.waitToFinalize({
      targetChain: l2PublicClient.chain,
      withdrawalHash: withdrawal.withdrawalHash,
      chain: undefined,
    });

    // 2. Finalize the withdrawal.
    const hash = await L1walletClient.finalizeWithdrawal({
      targetChain: l2PublicClient.chain,
      withdrawal,
    });

    // 3. Wait until the finalize withdrawal is processed.
    await l1PublicClient.waitForTransactionReceipt({
      hash,
    });

    dispatch(fetchTransactions({ address: address! }));
  };

  const getReceipt = async () => {
    if (!transaction) return;
    const receipt = await l2PublicClient
      .getTransactionReceipt({
        hash: transaction.transactionHash as AddressType,
      })
      .catch((error) => {});
    if (receipt) {
      setReceipt(receipt);
    }
  };

  useEffect(() => {
    getReceipt();
  }, []);

  const getTimimg = async () => {
    if (!opConfig) return;
    if (!receipt) return;
    const [message] = getWithdrawals(receipt);
    const { period, seconds, timestamp } =
      await l1PublicClient.getTimeToFinalize({
        targetChain: l2PublicClient.chain,
        withdrawalHash: message.withdrawalHash,
        chain: undefined,
      });
    console.log('ok');
    console.log({ period, seconds, timestamp });
  };

  useEffect(() => {
    getTimimg();
  }, []);

  const { switchNetworkPair: switchToL1 } = useSwitchNetworkDirection({
    direction: 'l1',
  });

  const getTransferTime = () => {
    const transferTimeTimeSecs = ENV.WITHDRAWAL_PERIOD + ENV.STATE_ROOT_PERIOD;
    return formatSecsString(transferTimeTimeSecs);
  };

  const buttonAction = () => {
    if (!transaction) return;
    if (l1.id !== chain?.id) {
      return (
        <button
          onClick={() => switchToL1()}
          className="mt-8 py-2 px-3 rounded-full text-sm bg-primary text-white font-semibold"
        >
          Switch to {l1.name}
        </button>
      );
    }
    if (transaction?.status === 'ready-to-prove')
      return (
        <button
          onClick={prove}
          className="mt-8 py-2 px-3 rounded-full text-sm bg-primary text-white font-semibold"
        >
          Prove
        </button>
      );
    if (transaction?.status === 'ready-to-finalize')
      return (
        <button
          onClick={finalize}
          className="mt-8 py-2 px-3 rounded-full text-sm bg-primary text-white font-semibold"
        >
          Finalize
        </button>
      );
  };

  return (
    <TransactionDetailWrapper>
      <BoxContainer>
        <div className="text-gray-900 font-semibold text-lg">
          Transaction Detail
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
                    {timeLocale} ({timePassed} ago)
                  </div>
                </div>
              </div>
              <div>
                <StatusBadge noIcon={true} status={transaction!.status} />
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
                  {ENV.L2_CHAIN_NAME}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="my-3">
          <StatusWithdrawal
            status="Withdrawn"
            link={`${L2NetworkExplorerUrl}/tx/${transaction!.transactionHash}`}
            transaction={transaction!}
            icon={'lucide:send'}
            textClassName="text-primary"
            iconClassName="text-primary"
          />
          <div className="border-l border-[#E4E7EC] h-3 translate-x-4 my-1" />
          <StatusWithdrawal
            status="State root published"
            transaction={transaction!}
            icon={'lucide:timer'}
            isLoading={transaction?.status === 'waiting-to-prove'}
            textClassName="text-green-600"
            iconClassName="text-green-600"
            detailText={
              <div className="text-gray-500 text-xs font-semibold">
                {' '}
                ~ {formatSecsString(ENV.STATE_ROOT_PERIOD)}
              </div>
            }
          />
          <div className="border-l border-[#E4E7EC] h-3 translate-x-4 my-1" />
          <StatusWithdrawal
            status="Prove"
            transaction={transaction!}
            icon={'icon-park-solid:transaction-order'}
            isLoading={false}
            textClassName="text-primary"
            iconClassName="text-primary"
            link={
              transaction?.prove
                ? `${L1NetworkExplorerUrl}/tx/${transaction.prove.transactionHash}`
                : undefined
            }
          />
          <div className="border-l border-[#E4E7EC] h-3 translate-x-4 my-1" />
          <StatusWithdrawal
            status="Challenge period"
            transaction={transaction!}
            icon={'lucide:calendar'}
            isLoading={transaction?.status === 'waiting-to-finalize'}
            textClassName="text-green-600"
            iconClassName="text-green-600"
            detailText={
              <div className="text-gray-500 text-xs font-semibold">
                {' '}
                ~ {formatSecsString(ENV.WITHDRAWAL_PERIOD)}
              </div>
            }
          />
          <div className="border-l border-[#E4E7EC] h-3 translate-x-4 my-1" />
          <StatusWithdrawal
            status="Claim withdrawal"
            transaction={transaction!}
            icon={'lucide:star'}
            isLoading={false}
            textClassName="text-primary"
            iconClassName="text-primary"
          />
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

        {transaction?.status !== 'finalized' && (
          <div className="text-xs text-center text-[#667085]">
            You can safely close this modal and check back later
          </div>
        )}
        <div className="w-full text-end">{buttonAction()}</div>
      </BoxContainer>
    </TransactionDetailWrapper>
  );
}

export default TransactionDetail;

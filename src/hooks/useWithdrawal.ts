import {
  useAccount,
  useEstimateFeesPerGas,
  useEstimateGas,
  usePublicClient,
} from 'wagmi';
import { useOPWagmiConfig } from './useOPWagmiConfig';
import { Chain, encodeFunctionData, Hash, parseEther, parseUnits } from 'viem';
import { l1StandardBridgeABI, l2StandardBridgeABI } from '@/abi/constant';
import { ERC20_DEPOSIT_MIN_GAS_LIMIT } from '@/utils';
import { Token } from '@/utils/opType';
import { useCallback, useMemo } from 'react';
import { useOPNetwork } from './useOPNetwork';
import { useWriteDepositETH } from './useWriteDepositETH';
import { useWriteWithdrawETH } from './useWriteWithdrawalETH';

type paramsArg = {
  address: `0x${string}` | undefined;
  amount: string | undefined;
  selectedTokenPair: [Token, Token];
};

export const OVM_ETH = '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000';

const useWithdrawal = ({ amount, selectedTokenPair, address }: paramsArg) => {
  const { chain } = useAccount();
  const estimateFeePerGas = useEstimateFeesPerGas({ chainId: chain?.id });

  const [_, l2Token] = selectedTokenPair;

  const { opConfig } = useOPWagmiConfig();

  const { networkPair } = useOPNetwork();
  const { l1, l2 } = networkPair;

  const l2Chains = opConfig?.l2chains;
  const l2PublicClient = usePublicClient({ chainId: l2.id });

  const txData = useMemo(() => {
    if (!l2Chains) {
      throw new Error('Cannot find l2Chains');
    }
    if (!address) {
      throw new Error('Cannot find address');
    }
    const l2StandardBridgeAddress =
      l2Chains[l2.id].l2Addresses.l2StandardBridge.address;
    if (!l2StandardBridgeAddress) {
      throw new Error(`Cannont find OptimismPortalProxy for chain id ${l2.id}`);
    }

    const isETH = l2Token.extensions.opTokenId.toLowerCase() === 'eth';
    const parsedAmount = isETH
      ? parseEther(amount ?? '0')
      : parseUnits(amount ?? '0', l2Token.decimals);

    const calldata = encodeFunctionData({
      abi: l2StandardBridgeABI,
      functionName: 'withdrawTo',
      args: [OVM_ETH, address, parsedAmount, 0, '0x'],
    });

    return {
      to: l2StandardBridgeAddress,
      amount: parsedAmount,
      calldata: calldata,
      isETH,
    };
  }, [
    l2Chains,
    l2.id,
    l2Token.extensions.opTokenId,
    amount,
    address,
    l2Token.decimals,
  ]);

  const { data: l2TxHash, writeWithdrawETHAsync } = useWriteWithdrawETH({
    config: opConfig,
  });

  const onSubmitWithdrawal = useCallback(async () => {
    if (!l2PublicClient) return;
    // if (txData.isETH) {
    await writeWithdrawETHAsync({
      args: {
        to: address,
        amount: txData.amount,
        extraData: txData.calldata,
      },
      l2ChainId: l2.id,
    });
  }, []);

  const gasEstimate = useEstimateGas({
    chainId: chain?.id,
    data: txData.calldata,
    to: txData.to,
    value: txData.amount,
  });

  const gasPrice = useMemo(() => {
    if (!gasEstimate.data || !estimateFeePerGas.data?.maxFeePerGas) {
      return 0n;
    }
    return estimateFeePerGas.data.maxFeePerGas * gasEstimate.data;
  }, [estimateFeePerGas.data?.maxFeePerGas, gasEstimate.data]);

  const txHash = l2TxHash;

  return {
    gasPending: gasEstimate.isPending || estimateFeePerGas.isPending,
    gasPrice: gasPrice,
    gasEstimate: gasEstimate.data || 0n,
    txHash,
    onSubmitWithdrawal,
  };
};

export default useWithdrawal;

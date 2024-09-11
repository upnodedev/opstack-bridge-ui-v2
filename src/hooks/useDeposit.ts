import {
  useAccount,
  useEstimateFeesPerGas,
  useEstimateGas,
  usePublicClient,
} from 'wagmi';
import { useOPWagmiConfig } from './useOPWagmiConfig';
import { Chain, encodeFunctionData, Hash, parseUnits } from 'viem';
import { l1StandardBridgeABI } from '@/abi/constant';
import { ERC20_DEPOSIT_MIN_GAS_LIMIT } from '@/utils';
import { Token } from '@/utils/opType';
import { useCallback, useMemo } from 'react';
import { useOPNetwork } from './useOPNetwork';
import { useWriteDepositETH } from './useWriteDepositETH';

type paramsArg = {
  address: `0x${string}` | undefined;
  amount: string | undefined;
  selectedTokenPair: [Token, Token];
};

const useDeposit = ({ amount, selectedTokenPair, address }: paramsArg) => {
  const { chain } = useAccount();
  const estimateFeePerGas = useEstimateFeesPerGas({ chainId: chain?.id });

  const { opConfig } = useOPWagmiConfig();

  const { networkPair } = useOPNetwork();
  const { l2, l1 } = networkPair;

  const l2Chains = opConfig?.l2chains;
  const l1PublicClient = usePublicClient({ chainId: l1.id });

  const txData = useMemo(() => {
    if (!l2Chains) {
      throw new Error('Cannot find l2Chains');
    }
    const addresses = l2Chains[l2.id].l1Addresses;
    if (!addresses) {
      throw new Error(`Cannont find OptimismPortalProxy for chain id ${l2.id}`);
    }

    let calldata: Hash;
    const [l1Token, l2Token] = selectedTokenPair;

    const isETH = l1Token.extensions.opTokenId.toLowerCase() === 'eth';
    const parsedAmount = parseUnits(amount ?? '0', l1Token.decimals);

    if (isETH) {
      calldata = encodeFunctionData({
        abi: l1StandardBridgeABI,
        functionName: 'depositETH',
        args: [ERC20_DEPOSIT_MIN_GAS_LIMIT, '0x'],
      });
    } else {
      calldata = encodeFunctionData({
        abi: l1StandardBridgeABI,
        functionName: 'depositERC20To',
        args: [
          l1Token.address,
          l2Token.address,
          addresses.l1StandardBridge.address,
          parsedAmount,
          ERC20_DEPOSIT_MIN_GAS_LIMIT,
          '0x',
        ],
      });
    }

    return {
      to: addresses.l1StandardBridge.address,
      amount: parsedAmount,
      calldata: calldata,
      isETH,
    };
  }, [amount, l2.id, selectedTokenPair, l2Chains]);

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

  const { data: l1TxHash, writeDepositETHAsync } = useWriteDepositETH({
    config: opConfig,
  });

  const txHash = l1TxHash;

  const onSubmitDeposit = useCallback(async () => {
    if (!l1PublicClient) return;
    if (txData.isETH) {
      return await writeDepositETHAsync({
        args: {
          to: address,
          amount: txData.amount,
          gasLimit: ERC20_DEPOSIT_MIN_GAS_LIMIT,
        },
        l2ChainId: l2.id,
      });
    }
  }, [l1PublicClient, txData.isETH, txData.amount, writeDepositETHAsync, address, l2.id]);

  return {
    gasPending: gasEstimate.isPending || estimateFeePerGas.isPending,
    gasPrice: gasPrice,
    gasEstimate: gasEstimate.data || 0n,
    txHash,
    onSubmitDeposit,
  };
};

export default useDeposit;

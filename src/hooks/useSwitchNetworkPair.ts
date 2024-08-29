import { NetworkDirection, NetworkPair } from '@/utils/opType';
import { useCallback } from 'react';
import { useSwitchChain } from 'wagmi';
import type { SwitchChainErrorType } from 'wagmi/actions';
import { useOPNetwork } from './useOPNetwork';

export type UseSwitchNetworkPairArgs = {
  direction: NetworkDirection;
};

export type UseSwitchNetworkPairReturnType = (
  args: UseSwitchNetworkPairArgs
) => {
  error: SwitchChainErrorType | null;
  isLoading: boolean;
  switchNetworkPair: () => void;
};

export const useSwitchNetworkDirection: UseSwitchNetworkPairReturnType = ({
  direction,
}: UseSwitchNetworkPairArgs) => {
  const { networkPair } = useOPNetwork();
  const { error, status, switchChain } = useSwitchChain();

  const switchNetworkPair = useCallback(() => {
    const { l1, l2 } = networkPair;
    switchChain?.({ chainId: direction === 'l1' ? l1.id : l2.id });
  }, [direction, networkPair, switchChain]);

  return {
    error,
    isLoading: status === 'pending',
    switchNetworkPair,
  };
};

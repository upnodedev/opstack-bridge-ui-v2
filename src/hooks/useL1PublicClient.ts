import { useOPNetwork } from "./useOPNetwork";
import { type UsePublicClientReturnType } from "wagmi";
import { PublicActionsL1, publicActionsL1 } from "viem/op-stack";
import { createPublicClient, http } from "viem";
import { NetworkType } from "@/utils/opType";

export type UseL1PublicClientArgs = {
  chainId?: number;
  type: NetworkType;
};

export type l1PublicClientType = Exclude<
  UsePublicClientReturnTypeL1,
  undefined
>;

export type UsePublicClientReturnTypeL1 = UsePublicClientReturnType &
  PublicActionsL1;

export type UseL1PublicClientReturnType = {
  l1PublicClient: Exclude<UsePublicClientReturnTypeL1, undefined>;
};

export const useL1PublicClient = (): UseL1PublicClientReturnType => {
  const { networkPair } = useOPNetwork();
  // const l1PublicClient = usePublicClient({
  //   chainId: networkPair?.l1.id,
  // })!.extend(publicActionsL1()) as any;
  const l1PublicClient = createPublicClient({
    chain: networkPair.l1,
    transport: http(),
  }).extend(publicActionsL1());
  return { l1PublicClient };
};

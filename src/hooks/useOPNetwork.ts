import { l1Chain, l2Chain } from "@/utils/chain";

export const useOPNetwork = () => {
  const networkPair = { l1: l1Chain, l2: l2Chain };

  return { networkPair };
};

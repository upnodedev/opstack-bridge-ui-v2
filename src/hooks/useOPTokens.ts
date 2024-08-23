// import { tokenlist } from "@configs/tokenList";
import { useMemo } from "react";

import { tokenListOnlyETH as tokenlist } from "@/utils/tokenListOnlyETH";
import { Token } from "@/utils/opType";

export type UseOPTokenArgs = {
  chainId?: number;
};

export const useOPTokens = ({ chainId }: UseOPTokenArgs) => {
  const tokens = useMemo<Token[]>(() => {
    if (!chainId) {
      alert(tokenlist);
      return tokenlist as Token[];
    }
    return tokenlist.filter(
      (token) => token.chainId === chainId,
    ) as Token[];
  }, [chainId]);

  const ethToken = useMemo<Token>(() => {
    return tokens.filter((token) => token.symbol.toLowerCase() === "eth")[0];
  }, [tokens]);

  const erc20Tokens = useMemo<Token[]>(() => {
    return tokens.filter((token) => token.symbol.toLowerCase() !== "eth");
  }, [tokens]);

  return {
    ethToken,
    erc20Tokens,
  };
};

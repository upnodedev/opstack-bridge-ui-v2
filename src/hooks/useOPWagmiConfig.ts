import { useMemo } from "react";
import { useConfig } from "wagmi";

// import { deploymentAddresses } from "../configs/deploymentAddresses";
import { useOPNetwork } from "./useOPNetwork";
import { OpConfig } from "@/utils/opType";
import ENV from "@/utils/ENV";
// import { predeploys } from "@abi/constant";

export const useOPWagmiConfig = () => {
  const config = useConfig();
  const { networkPair } = useOPNetwork();

  const opConfig = useMemo<OpConfig | undefined>(() => {
    if (!networkPair) {
      return;
    }

    const { l1, l2 } = networkPair;
    // const deploymentAddress = deploymentAddresses[l2.id];

    return {
      ...config,
      l2chains: {
        [l2.id]: {
          chainId: l2.id,
          l1ChainId: l1.id,
          l1Addresses: {
            portal: {
              address: ENV.PORTAL_PROXY_ADDRESS,
              chainId: l1.id,
            },
            l2OutputOracle: {
              address: ENV.L2_OUTPUT_ORACLE_PROXY_ADDRESS,
              chainId: l1.id,
            },
            l1StandardBridge: {
              address: ENV.L1_STANDARD_BRIDGE_PROXY_ADDRESS,
              chainId: l1.id,
            },
            l1CrossDomainMessenger: {
              address: ENV.L1_CROSS_DOMAIN_MESSENGER_PROXY_ADDRESS,
              chainId: l1.id,
            },
            l1Erc721Bridge: {
              address: ENV.L1_ERC721_BRIDGE_ADDRESS_PROXY,
              chainId: l1.id,
            },
            disputeGameFactory: {
              address: ENV.DISPUTE_GAME_FACTORY_PROXY,
              chainId: l1.id,
            },
          },
          l2Addresses: {
            l2L1MessagePasserAddress: {
              address: ENV.L2_L1_MESSAGE_PASSER_ADDRESS,
              chainId: l2.id,
            },
            l2StandardBridge: {
              address: ENV.L2_STANDARD_BRIDGE_PROXY_ADDRESS,
              chainId: l2.id,
            },
          },
        },
      },
    } as OpConfig;
  }, [config, networkPair]);

  return { opConfig };
};

export type UseOPWagmiConfigReturnType = ReturnType<typeof useOPWagmiConfig>;

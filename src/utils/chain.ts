import ENV from './ENV';
import { Chain } from '@rainbow-me/rainbowkit';

console.log(ENV);

// clone of mainnet and edit the chainId
export const l1Chain = {
  name: ENV.L1_CHAIN_NAME,
  id: +ENV.L1_CHAIN_ID,
  iconUrl: ENV.L1_LOGO_URL,
  iconBackground: '#fff',
  rpcUrls: {
    default: {
      http: [ENV.L1_RPC_URL],
    },
  },
  nativeCurrency: {
    decimals: ENV.L1_NATIVE_CURRENCY_DECIMALS,
    name: ENV.L1_NATIVE_CURRENCY_NAME,
    symbol: ENV.L1_NATIVE_CURRENCY_SYMBOL,
  },
  blockExplorers: {
    default: {
      name: ENV.L1_BLOCK_EXPLORER_NAME,
      url: ENV.L1_BLOCK_EXPLORER_URL,
      apiUrl: ENV.L1_BLOCK_EXPLORER_API,
    },
  },
  contracts: {
    multicall3: {
      address: ENV.L1_MULTI_CALL3_ADDRESS,
      blockCreated: ENV.L1_MULTI_CALL3_BLOCK_CREATED,
    },
    ensRegistry: { address: ENV.L1_ENS_REGISTRY_ADDRESS },
    ensUniversalResolver: {
      address: ENV.L1_ENS_UNIVERSAL_RESOLVER_ADDRESS,
    },
  },
} as const satisfies Chain;

export const l2Chain = {
  name: ENV.L2_CHAIN_NAME,
  id: +ENV.L2_CHAIN_ID,
  iconUrl: ENV.L2_LOGO_URL,
  iconBackground: '#fff',
  rpcUrls: {
    default: {
      http: [ENV.L2_RPC_URL],
    },
  },
  nativeCurrency: {
    decimals: ENV.L2_NATIVE_CURRENCY_DECIMALS,
    name: ENV.L2_NATIVE_CURRENCY_NAME,
    symbol: ENV.L2_NATIVE_CURRENCY_SYMBOL,
  },
  blockExplorers: {
    default: {
      name: ENV.L2_BLOCK_EXPLORER_NAME,
      url: ENV.L2_BLOCK_EXPLORER_URL,
      apiUrl: ENV.L2_BLOCK_EXPLORER_API,
    },
  },
  contracts: {
    disputeGameFactory: {
      [l1Chain.id]: {
        address: ENV.DISPUTE_GAME_FACTORY_PROXY,
      },
    },
    l2OutputOracle: {
      [l1Chain.id]: {
        address: ENV.L2_OUTPUT_ORACLE_PROXY_ADDRESS,
      },
    },
    portal: {
      [l1Chain.id]: {
        address: ENV.PORTAL_PROXY_ADDRESS,
      },
    },
    l1StandardBridge: {
      [l1Chain.id]: {
        address: ENV.L1_STANDARD_BRIDGE_PROXY_ADDRESS,
      },
    },
    l2StandardBridge: {
      address: ENV.L2_STANDARD_BRIDGE_PROXY_ADDRESS,
    },
  },
  sourceId: l1Chain.id,
} as const satisfies Chain;


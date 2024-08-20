import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, http } from 'wagmi';
import { mainnet, optimism } from 'wagmi/chains';
import { lightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { ReactNode } from 'react';

const config = getDefaultConfig({
  appName: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  projectId: import.meta.env.VITE_APP_NAME,
  chains: [mainnet, optimism],
  transports: {
    [mainnet.id]: http(),
    [optimism.id]: http(),
  },
});
const queryClient = new QueryClient();

const WalletProvider = ({ children }: { children: ReactNode }) => {
  console.log(import.meta.env.VITE_COLOR_PRIMARY);
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={lightTheme({
          accentColor: import.meta.env.VITE_COLOR_PRIMARY,
        })}>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default WalletProvider;

import Layout from './components/Layout';
import WalletProvider from './components/WalletProvider';
import { UsdtPriceProvider } from './contexts/UsdtPriceContext';
import Mainview from './views';

function App() {
  return (
    <UsdtPriceProvider>
      <WalletProvider>
        <Layout>
          <Mainview />
        </Layout>
      </WalletProvider>
    </UsdtPriceProvider>
  );
}

export default App;

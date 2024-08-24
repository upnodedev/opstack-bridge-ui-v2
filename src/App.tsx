import Layout from './components/Layout';
import WalletProvider from './components/WalletProvider';
import { UsdtPriceProvider } from './contexts/UsdtPriceContext';
import { store } from './states/store';
import Mainview from './views';
import { Provider as ReduxToolkitProvider } from 'react-redux';

function App() {
  return (
    <ReduxToolkitProvider store={store}>
      <UsdtPriceProvider>
        <WalletProvider>
          <Layout>
            <Mainview />
          </Layout>
        </WalletProvider>
      </UsdtPriceProvider>
    </ReduxToolkitProvider>
  );
}

export default App;

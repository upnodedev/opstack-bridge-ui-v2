import Layout from './components/Layout';
import WalletProvider from './components/WalletProvider';
import Mainview from './views';

function App() {
  return (
    <WalletProvider>
      <Layout>
        <Mainview />
      </Layout>
    </WalletProvider>
  );
}

export default App;

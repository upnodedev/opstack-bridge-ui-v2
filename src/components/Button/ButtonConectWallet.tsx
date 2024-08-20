import { ConnectButton } from '@rainbow-me/rainbowkit';

interface Props extends SimpleComponent {}

function ButtonConectWallet(props: Props) {
  return <ConnectButton chainStatus={'icon'} />;
}

export default ButtonConectWallet;

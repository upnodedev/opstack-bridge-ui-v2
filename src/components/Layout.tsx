import styled from 'styled-components';
import MainLogo from '@/assets/upnode.png';
import ButtonConectWallet from './Button/ButtonConectWallet';
import { ReactNode } from 'react';

interface Props extends SimpleComponent {
  children?: ReactNode;
}

const LayoutWrapper = styled.div`
  max-width: 100vw;
  max-height: 100vh;
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
`;

function Layout(props: Props) {
  return (
    <LayoutWrapper>
      {/* header */}
      <div className="w-full flex justify-between px-10 h-16 items-center fixed top-0 left-0">
        <div className="flex items-center gap-2">
          <img src={MainLogo} alt="logo" className="h-10" />
          {/* <div className='flex flex-col text-primary'>
            <b className='tracking-widest'>UPNODE</b>
            <b>Bridge</b>
          </div> */}
        </div>
        <ButtonConectWallet />
      </div>
      <div className="h-full max-h-screen pt-20 pb-6 px-4">{props.children}</div>
    </LayoutWrapper>
  );
}

export default Layout;

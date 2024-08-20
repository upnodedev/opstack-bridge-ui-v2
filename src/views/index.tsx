import styled from 'styled-components';
import Bridge from './Bridge';
import { useRef, useState } from 'react';
import Transaction from './Transaction';
import BoxAnimate from '@/components/Box/BoxAnimate';

interface Props extends SimpleComponent {}

const MainviewWrapper = styled.div``;

function Mainview(props: Props) {
  const [state, setState] = useState('bridgeDeposit');
  return (
    <MainviewWrapper className="max-w-screen-sm w-full mx-auto relative">
      <div
        onClick={() => {
          setState('transaction');
        }}
        className='text-primary'
      >
        transaction
      </div>
      <div
        className='text-secondary'
        onClick={() => {
          setState('bridgeDeposit');
        }}
      >
        deposit
      </div>
      <BoxAnimate isShow={state === 'bridgeDeposit'}>
        <Bridge />
      </BoxAnimate>

      <BoxAnimate isShow={state === 'transaction'}>
        <Transaction />
      </BoxAnimate>
    </MainviewWrapper>
  );
}

export default Mainview;

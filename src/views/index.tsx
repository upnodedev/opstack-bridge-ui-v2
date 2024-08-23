import styled from 'styled-components';
import Bridge from './Bridge';
import { useRef, useState } from 'react';
import Transaction from './Transaction';
import BoxAnimate from '@/components/Box/BoxAnimate';
import ReviewDeposit from './Bridge/ReviewDeposit';

interface Props extends SimpleComponent {}

const MainviewWrapper = styled.div``;

function Mainview(props: Props) {
  const [page, setPage] = useState('bridgeDeposit');
  const [amount, setAmount] = useState<string | undefined>('0.001');
  return (
    <MainviewWrapper className="max-w-screen-sm w-full mx-auto relative">

      <BoxAnimate isShow={page === 'bridgeDeposit'}>
        <Bridge amount={amount} setAmount={setAmount} setPage={setPage} />
      </BoxAnimate>

      <BoxAnimate isShow={page === 'reviewDeposit'}>
        <ReviewDeposit
          amount={amount}
          setAmount={setAmount}
          setPage={setPage}
        />
      </BoxAnimate>

      <BoxAnimate isShow={page === 'transaction'}>
        <Transaction />
      </BoxAnimate>
    </MainviewWrapper>
  );
}

export default Mainview;

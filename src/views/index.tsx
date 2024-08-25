import styled from 'styled-components';
import Bridge from './Bridge';
import { useRef, useState } from 'react';
import Transaction from './Transaction';
import BoxAnimate from '@/components/Box/BoxAnimate';
import ReviewDeposit from './Bridge/ReviewDeposit';
import { useAppSelector } from '@/states/hooks';
import Modal from '@/components/Modal';

interface Props extends SimpleComponent {}

const MainviewWrapper = styled.div``;

function Mainview(props: Props) {
  const [amount, setAmount] = useState<string | undefined>('0.001');
  const page = useAppSelector((state) => state.layout.currentPage);
  console.log({ page });
  return (
    <MainviewWrapper className="max-w-screen-sm w-full mx-auto relative">
      <BoxAnimate isShow={page === 'bridgeDeposit'}>
        <Bridge amount={amount} setAmount={setAmount} />
      </BoxAnimate>

      <BoxAnimate isShow={page === 'transaction'}>
        <Transaction />
      </BoxAnimate>

      <Modal modalId="reviewDeposit">
        <ReviewDeposit amount={amount} setAmount={setAmount} />
      </Modal>
    </MainviewWrapper>
  );
}

export default Mainview;

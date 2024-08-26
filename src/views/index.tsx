import styled from 'styled-components';
import { useCallback, useEffect, useRef, useState } from 'react';
import Transaction from './Transaction';
import BoxAnimate from '@/components/Box/BoxAnimate';
import ReviewDeposit from './Bridge/ReviewDeposit';
import { useAppDispatch, useAppSelector } from '@/states/hooks';
import Modal from '@/components/Modal';
import { openModal } from '@/states/modal/reducer';
import Bridge from './Bridge/Deposit';
import { Token } from '@/utils/opType';
import { useOPTokens } from '@/hooks/useOPTokens';
import { useOPNetwork } from '@/hooks/useOPNetwork';

interface Props extends SimpleComponent {}

const MainviewWrapper = styled.div``;

function Mainview(props: Props) {
  // deposit value
  const [amount, setAmount] = useState<string | undefined>(undefined);
  const { networkPair } = useOPNetwork();
  const { l1, l2 } = networkPair;
  const { ethToken: l1EthToken } = useOPTokens({ chainId: networkPair.l1.id });
  const { ethToken: l2EthToken } = useOPTokens({ chainId: networkPair.l2.id });
  const [selectedTokenPair, setSelectedTokenPair] = useState<[Token, Token]>([
    l1EthToken,
    l2EthToken,
  ]);

  const onTokenChange = useCallback(
    (l1Token: Token, l2Token: Token) => {
      setSelectedTokenPair([l1Token, l2Token]);
    },
    [setSelectedTokenPair]
  );

  const onAmountChange = (e: any) => {
    setAmount(e.target.value);
  };

  const page = useAppSelector((state) => state.layout.currentPage);

  return (
    <MainviewWrapper className="max-w-screen-sm w-full mx-auto relative">
      <BoxAnimate isShow={page === 'bridgeDeposit'}>
        <Bridge
          amount={amount}
          onAmountChange={onAmountChange}
          l1={l1}
          l2={l2}
          selectedTokenPair={selectedTokenPair}
        />
      </BoxAnimate>

      <BoxAnimate isShow={page === 'transaction'}>
        <Transaction />
      </BoxAnimate>

      <Modal modalId="reviewDeposit">
        <ReviewDeposit
          amount={amount}
          l1={l1}
          l2={l2}
          selectedTokenPair={selectedTokenPair}
        />
      </Modal>
    </MainviewWrapper>
  );
}

export default Mainview;

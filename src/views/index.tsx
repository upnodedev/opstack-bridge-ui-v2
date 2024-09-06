import BoxAnimate from '@/components/Box/BoxAnimate';
import Modal from '@/components/Modal';
import { useOPNetwork } from '@/hooks/useOPNetwork';
import { useOPTokens } from '@/hooks/useOPTokens';
import { useAppDispatch, useAppSelector } from '@/states/hooks';
import { Token } from '@/utils/opType';
import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { useAccount } from 'wagmi';
import Bridge from './Bridge/Bridge';
import ReviewDeposit from './Bridge/ReviewDeposit';
import ReviewWithdrawal from './Bridge/ReviewWithdrawal';
import Transaction from './Transaction';
import TransactionDetail from './Transaction/detail';
import { openModal } from '@/states/modal/reducer';

interface Props extends SimpleComponent {}

const MainviewWrapper = styled.div``;

function Mainview(props: Props) {
  // deposit value
  const { isConnected, chain } = useAccount();
  const [amount, setAmount] = useState<string | undefined>(undefined);
  const { networkPair } = useOPNetwork();
  const { l1, l2 } = networkPair;
  const { ethToken: l1EthToken } = useOPTokens({ chainId: networkPair.l1.id });
  const { ethToken: l2EthToken } = useOPTokens({ chainId: networkPair.l2.id });
  const [selectedTokenPair, setSelectedTokenPair] = useState<[Token, Token]>([
    l1EthToken,
    l2EthToken,
  ]);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const dispatch = useAppDispatch();

  const onTokenChange = useCallback(
    (l1Token: Token, l2Token: Token) => {
      setSelectedTokenPair([l1Token, l2Token]);
    },
    [setSelectedTokenPair]
  );

  const onAmountChange = (e: any) => {
    setAmount(e.target.value);
  };

  const onClickDetail = (txHash: `0x${string}`) => {
    setTxHash(txHash);
    dispatch(openModal('transactionDetail'));
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
        <Transaction l1={l1} l2={l2} onClickDetail={onClickDetail} />
      </BoxAnimate>

      <Modal modalId="transactionDetail">
        <TransactionDetail l1={l1} l2={l2} txHash={txHash} />
      </Modal>

      <Modal modalId="reviewDeposit">
        <ReviewDeposit
          amount={amount}
          l1={l1}
          l2={l2}
          selectedTokenPair={selectedTokenPair}
        />
      </Modal>

      <Modal modalId="reviewWithdrawal">
        <ReviewWithdrawal
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

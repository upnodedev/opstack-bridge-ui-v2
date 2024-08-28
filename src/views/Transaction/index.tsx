import BoxContainer from '@/components/Box/BoxContainer';
import { fetchDeposits } from '@/states/deposit/reducer';
import { useAppDispatch, useAppSelector } from '@/states/hooks';
import { fetchWithdraws } from '@/states/withdrawal/reducer';
import { useEffect } from 'react';
import styled from 'styled-components';
import { useAccount } from 'wagmi';

interface Props extends SimpleComponent {}

const TransactionWrapper = styled.div``;

function Transaction(props: Props) {
  const dispatch = useAppDispatch();
  const deposits = useAppSelector((state) => state.deposit);
  const withdrawals = useAppSelector((state) => state.withdrawal);
  const { address } = useAccount();

  useEffect(() => {
    dispatch(
      fetchDeposits({ page: 1, limit: 10, sender: address, receiver: address })
    );
    dispatch(
      fetchWithdraws({ page: 1, limit: 10, sender: address, receiver: address })
    );
  }, [dispatch, address]);
  return (
    <TransactionWrapper>
      <BoxContainer hasExit={true}>Transaction</BoxContainer>
    </TransactionWrapper>
  );
}

export default Transaction;

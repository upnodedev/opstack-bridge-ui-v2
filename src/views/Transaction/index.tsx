import BoxContainer from '@/components/Box/BoxContainer';
import styled from 'styled-components';

interface Props extends SimpleComponent {}

const TransactionWrapper = styled.div``;

function Transaction(props: Props) {
  return (
    <TransactionWrapper>
      <BoxContainer>Transaction</BoxContainer>
    </TransactionWrapper>
  );
}

export default Transaction;

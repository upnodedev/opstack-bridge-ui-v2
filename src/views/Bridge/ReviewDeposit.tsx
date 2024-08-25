import BoxContainer from '@/components/Box/BoxContainer';
import styled from 'styled-components';

interface Props extends SimpleComponent {
  amount: string | undefined;
  setAmount: (amount: string) => void;
}

const ReviewDepositWrapper = styled.div``;

function ReviewDeposit({ amount, setAmount }: Props) {
  return (
    <ReviewDepositWrapper>
      <BoxContainer>
        <div className="flex flex-col gap-4"></div>
      </BoxContainer>
    </ReviewDepositWrapper>
  );
}

export default ReviewDeposit;

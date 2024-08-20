import BoxContainer from '@/components/Box/BoxContainer';
import styled from 'styled-components';

interface Props extends SimpleComponent {}

const BridgeWrapper = styled.div``;

function Bridge(props: Props) {
  return (
    <BridgeWrapper>
      <BoxContainer>Bridge</BoxContainer>
    </BridgeWrapper>
  );
}

export default Bridge;

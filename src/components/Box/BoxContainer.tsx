import styled from 'styled-components';

interface Props extends SimpleComponent {
  children: React.ReactNode;
}

const BoxContainerWrapper = styled.div``;

function BoxContainer(props: Props) {
  return (
    <BoxContainerWrapper className="w-full shadow-md border-red-500 border-2 h-[40rem]">
      {props.children}
    </BoxContainerWrapper>
  );
}

export default BoxContainer;

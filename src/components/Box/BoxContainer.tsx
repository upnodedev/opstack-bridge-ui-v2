import styled from 'styled-components';

interface Props extends SimpleComponent {
  children: React.ReactNode;
}

const BoxContainerWrapper = styled.div``;

function BoxContainer(props: Props) {
  return (
    <BoxContainerWrapper className="w-full min-h-[40rem] shadow-sm rounded-[1.5rem] p-4 border-gray-300 border-[1px] overflow-scroll">
      {props.children}
    </BoxContainerWrapper>
  );
}

export default BoxContainer;

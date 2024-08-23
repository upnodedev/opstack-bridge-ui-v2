import { Icon } from '@iconify/react/dist/iconify.js';
import styled from 'styled-components';

interface Props extends SimpleComponent {
  children: React.ReactNode;
  setPage?: (page: string) => void;
}

const BoxContainerWrapper = styled.div``;

function BoxContainer(props: Props) {
  return (
    <BoxContainerWrapper className="w-full min-h-[40rem] shadow-sm rounded-[1.5rem] p-4 border-gray-300 border-[1px] overflow-scroll relative">
      {props.setPage && (
        <div
          onClick={() => {
            if (props.setPage) {
              props.setPage('bridgeDeposit');
            }
          }}
          className="absolute right-2 top-2 z-10 text-gray-500 hover:text-gray-400 cursor-pointer"
        >
          <Icon icon={'ion:close'} className="text-display-md " />
        </div>
      )}
      {props.children}
    </BoxContainerWrapper>
  );
}

export default BoxContainer;

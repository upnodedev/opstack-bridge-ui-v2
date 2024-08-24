import { useAppDispatch } from '@/states/hooks';
import { closePage } from '@/states/layout/reducer';
import { Icon } from '@iconify/react/dist/iconify.js';
import styled from 'styled-components';

interface Props extends SimpleComponent {
  children: React.ReactNode;
  hasExit?: boolean;
}

const BoxContainerWrapper = styled.div``;

function BoxContainer(props: Props) {
  const dispatch = useAppDispatch();
  return (
    <BoxContainerWrapper className="w-full min-h-[40rem] shadow-sm rounded-[1.5rem] bg-white p-4 border-gray-300 border-[1px] overflow-scroll relative">
      {props.hasExit && (
        <div
          onClick={() => {
            dispatch(closePage());
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

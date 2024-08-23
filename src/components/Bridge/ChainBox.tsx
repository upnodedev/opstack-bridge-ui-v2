import ENV from '@/utils/ENV';
import { Icon } from '@iconify/react/dist/iconify.js';
import styled from 'styled-components';

interface Props extends SimpleComponent {
  type: 'withdrawal' | 'deposit';
}

const ChainBoxWrapper = styled.div``;

function ChainBox(props: Props) {
  return (
    <ChainBoxWrapper className="flex flex-col gap-4 relative">
      <div className="w-full rounded-2xl border-[1px] border-gray-300 bg-gray-100 flex justify-between items-center py-2 px-4 relative overflow-hidden z-30">
        <img
          src={`${
            props.type === 'deposit' ? ENV.L1_LOGO_URL : ENV.L2_LOGO_URL
          }`}
          alt=""
          className="h-[200%] absolute top-1/2 right-[2.5rem] -translate-y-1/2 opacity-30"
        />
        <div className="flex items-center gap-4 relative">
          <div className="h-[2rem] w-[2rem] rounded-full bg-white flex gap-4">
            <img
              src={`${
                props.type === 'deposit' ? ENV.L1_LOGO_URL : ENV.L2_LOGO_URL
              }`}
              alt=""
              className="object-contain"
            />
          </div>
          <div className="relative">
            <div className="text-lg font-bold">From</div>
            <div className="text-sm text-gray-500">{`${
              props.type === 'deposit' ? ENV.L1_CHAIN_NAME : ENV.L2_CHAIN_NAME
            }`}</div>
          </div>
        </div>
      </div>

      <div className="w-[3rem] h-[3rem] rounded-full bg-primary flex justify-center items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[1rem] z-20">
        <Icon
          icon={'icon-park-outline:double-down'}
          fontSize={'1.6rem'}
          className="text-white"
        />
      </div>

      <div className="w-full rounded-2xl border-[1px] border-gray-300 bg-gray-100 flex justify-between items-center py-2 px-4 relative overflow-hidden z-10">
        <img
          src={`${
            props.type === 'deposit' ? ENV.L2_LOGO_URL : ENV.L1_LOGO_URL
          }`}
          alt=""
          className="h-[200%] absolute top-1/2 right-[2.5rem] -translate-y-1/2 opacity-30"
        />
        <div className="flex items-center gap-4 relative">
          <div className="h-[2rem] w-[2rem] rounded-full bg-white flex gap-4">
            <img
              src={`${
                props.type === 'deposit' ? ENV.L2_LOGO_URL : ENV.L1_LOGO_URL
              }`}
              alt=""
              className="object-contain"
            />
          </div>
          <div className="relative">
            <div className="text-lg font-bold">To</div>
            <div className="text-sm text-gray-500">{`${
              props.type === 'deposit' ? ENV.L2_CHAIN_NAME : ENV.L1_CHAIN_NAME
            }`}</div>
          </div>
        </div>
      </div>
    </ChainBoxWrapper>
  );
}

export default ChainBox;

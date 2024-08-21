import BoxContainer from '@/components/Box/BoxContainer';
import ENV from '@/utils/ENV';
import { useState } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';

interface Props extends SimpleComponent {}

const BridgeWrapper = styled.div``;

function Bridge(props: Props) {
  const [mode, setMode] = useState('deposit');

  const onClickMode = (mode: string) => {
    setMode(mode);
  };

  return (
    <BoxContainer>
      <div className="flex flex-col gap-4">
        {/*  */}
        <div className="flex justify-between items-center">
          <div className="flex border-[1px] border-gray-300 bg-gray-100 rounded-full px-2 py-2 gap-2">
            <button
              className={`w-[8rem] py-1 bg-transparent transition-all rounded-full border-[1px] ${
                mode === 'deposit'
                  ? 'text-primary border-primary'
                  : 'text-gray-600 border-transparent'
              }`}
              onClick={() => onClickMode('deposit')}
            >
              Depisit
            </button>
            <button
              className={`w-[8rem] py-1 bg-transparent transition-all rounded-full border-[1px] ${
                mode === 'withdrawal'
                  ? 'text-primary border-primary'
                  : 'text-gray-600 border-transparent'
              }`}
              onClick={() => onClickMode('withdrawal')}
            >
              Withdrawal
            </button>
          </div>

          <button
            className={`w-[8rem] py-1 bg-transparent transition-all rounded-full border-[1px] text-primary border-primary flex items-center justify-center gap-2`}
          >
            Activity
            <div className="w-5 h-5 flex items-center justify-center text-center rounded-full bg-red-500 text-white text-xs">
              1
            </div>
          </button>
        </div>
        {/*  */}
        <div className="w-full rounded-2xl border-[1px] border-gray-300 bg-gray-100 flex justify-between items-center h-[5.5rem] py-2 px-4">
          <div className="h-[3rem] w-[3rem] rounded-full bg-white">
            <img src={`${ENV.L1_LOGO_URL}`} alt="" className="object-contain" />
          </div>
          <div>
            <div className="text-lg font-bold">Ethereum</div>
            <div className="text-sm text-gray-500">Ethereum</div>
          </div>
          <div className="h-[3rem] w-[3rem] rounded-full bg-white border-[1px] border-primary">
            <Icon icon={''}/>
          </div>
        </div>
      </div>
    </BoxContainer>
  );
}

export default Bridge;

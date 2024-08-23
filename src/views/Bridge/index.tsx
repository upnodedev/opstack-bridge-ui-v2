import BoxContainer from '@/components/Box/BoxContainer';
import ENV from '@/utils/ENV';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import ButtonStyled from '@/components/Button/ButtonStyled';
import ChainBox from '@/components/Bridge/ChainBox';
import DepositDetail from '@/components/Bridge/DepositDetail';
import PoweredBy from '@/components/PoweredBy';
import { useOPNetwork } from '@/hooks/useOPNetwork';
import { useOPTokens } from '@/hooks/useOPTokens';
import { Token } from '@/utils/opType';
import { useReadBalance } from '@/hooks/useReadBalance';
import { parseEther } from 'viem';

interface Props extends SimpleComponent {}

const BridgeWrapper = styled.div``;

function Bridge(props: Props) {
  const [mode, setMode] = useState('deposit');
  const [amount, setAmount] = useState<string | undefined>(undefined);
  const [validationError, setValidationError] = useState<string | undefined>(
    undefined
  );

  const { networkPair } = useOPNetwork();
  const { l1, l2 } = networkPair;

  const { ethToken: l1EthToken } = useOPTokens({ chainId: networkPair.l1.id });
  const { ethToken: l2EthToken } = useOPTokens({ chainId: networkPair.l2.id });
  const [selectedTokenPair, setSelectedTokenPair] = useState<[Token, Token]>([
    l1EthToken,
    l2EthToken,
  ]);

  const [l1Token, l2Token] = selectedTokenPair;

  const onTokenChange = useCallback(
    (l1Token: Token, l2Token: Token) => {
      setSelectedTokenPair([l1Token, l2Token]);
    },
    [setSelectedTokenPair]
  );

  const onClickMode = (mode: string) => {
    setMode(mode);
  };

  const balance = useReadBalance({
    chain: l1,
    // chain: l1,
    selectedToken: l1Token,
  });


  useEffect(() => {
    if (typeof amount === 'undefined') {
      if (typeof amount === 'undefined') {
        setValidationError('');
        return;
      }

      const bigAmount = parseEther(amount);
      if (balance && bigAmount > balance.data.value) {
        setValidationError('Insufficent Balance');
      }

      setValidationError('');
    }

    const bigAmount = parseEther(amount);
    if (balance && bigAmount > balance.data.value) {
      setValidationError('Insufficent Balance');
      return;
    }

    return;
  }, [amount]);

  const onAmountChange = (amount: string) => {
    setAmount(amount);
  }

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

        <ChainBox type="deposit" />

        {/*  */}
        <div className="w-full rounded-2xl border-[1px] border-gray-300 bg-gray-100 flex justify-between items-center py-2 px-4 relative">
          <div className="flex flex-col">
            <input
              className={`${
                validationError ? 'outline-solid outline-red-500' : ''
              } 
              w-[180px] rounded-xl border-0 py-1 text-right text-2xl font-bold text-black outline-none`}
              placeholder="0.0"
              type="number"
              autoFocus={true}
              maxLength={80}
              min={0}
              onChange={(e) => onAmountChange(e.target.value)}
            />
            <span className="text-gray-500">$0.0001</span>
          </div>
          <div>
            <div className="flex items-center justify-between bg-primary rounded-full px-4 py-2 gap-2">
              <div className="flex items-center gap-2">
                <div className="w-[1.5rem] h-[1.5rem] p-1 rounded-full bg-white">
                  <img
                    src={`${ENV.L1_LOGO_URL}`}
                    alt=""
                    className="object-contain w-full h-full"
                  />
                </div>
                <span className="text-white">
                  {ENV.L1_NATIVE_CURRENCY_SYMBOL}
                </span>
              </div>
              <div>
                <Icon
                  icon={'icon-park-outline:down'}
                  fontSize={'1.5rem'}
                  className="text-white"
                />
              </div>
            </div>
            <p className="mt-2">
              Bal : 20,000 {ENV.L1_NATIVE_CURRENCY_SYMBOL}{' '}
              <span className="text-primary font-bold">max</span>
            </p>
          </div>
        </div>

        <DepositDetail />

        <ButtonStyled>
          <div>Deposit</div>
        </ButtonStyled>

        {/*  */}
        <PoweredBy />
      </div>
    </BoxContainer>
  );
}

export default Bridge;

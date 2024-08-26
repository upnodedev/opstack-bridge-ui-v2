import BoxContainer from '@/components/Box/BoxContainer';
import ENV from '@/utils/ENV';
import { useCallback, useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import ButtonStyled from '@/components/Button/ButtonStyled';
import ChainBox from '@/components/Bridge/ChainBox';
import DepositDetail from '@/components/Bridge/DepositDetail';
import PoweredBy from '@/components/PoweredBy';
import { Token } from '@/utils/opType';
import { useReadBalance } from '@/hooks/useReadBalance';
import { Chain, parseEther } from 'viem';
import { useAccount } from 'wagmi';
import { useAppDispatch } from '@/states/hooks';
import { openModal } from '@/states/modal/reducer';
import { openPage } from '@/states/layout/reducer';
import { l1Chain, l2Chain } from '@/utils/chain';
import { useUsdtPrice } from '@/contexts/UsdtPriceContext';

interface Props extends SimpleComponent {
  amount: string | undefined;
  onAmountChange: (e: any) => void;
  selectedTokenPair: [Token, Token];
  l1: typeof l1Chain;
  l2: typeof l2Chain;
}

function Bridge({ amount, onAmountChange, selectedTokenPair, l1, l2 }: Props) {
  const { isConnected } = useAccount();
  const dispatch = useAppDispatch();
  const [mode, setMode] = useState('deposit');
  const [validationError, setValidationError] = useState<string | undefined>(
    undefined
  );

  const [l1Token] = selectedTokenPair;

  const onClickMode = (mode: string) => {
    setMode(mode);
  };

  const balance = useReadBalance({
    chain: l1,
    // chain: l1,
    selectedToken: l1Token,
  });

  useEffect(() => {
    if (typeof amount === 'undefined' || amount === '') {
      setValidationError('Please enter amount');
      return;
    }

    const bigAmount = parseEther(amount);
    if (balance && bigAmount > balance.data.value) {
      setValidationError('Insufficent Balance');
      return;
    }

    setValidationError('');
    return;
  }, [amount, balance]);

  const reviewDeposit = () => {
    dispatch(openModal('reviewDeposit'));
  };

  const openTranaction = () => {
    dispatch(openPage('transaction'));
  };

  const usdtPrice = useUsdtPrice(l1.nativeCurrency.symbol);

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
            onClick={openTranaction}
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
        <div className="w-full rounded-2xl border-[1px] border-gray-300 bg-gray-100 flex items-center py-2 px-4 relative gap-5">
          <div className="flex flex-col flex-1">
            <input
              className={`w-full text-display-md text-left font-bold text-black outline-none bg-transparent`}
              placeholder="0.0"
              type="number"
              autoFocus={true}
              maxLength={80}
              min={0}
              value={amount ? amount : ''}
              onChange={onAmountChange}
            />
            <span className="text-gray-500 mt-2 h-6">{usdtPrice && amount ? `$${(usdtPrice * +amount).toFixed(8)}` : '' }</span>
          </div>
          <div className="">
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

        <DepositDetail
          l1={l1}
          l2={l2}
          amount={amount}
          selectedTokenPair={selectedTokenPair}
        />

        {isConnected ? (
          <ButtonStyled disabled={!!validationError} onClick={reviewDeposit}>
            {validationError ? validationError : 'Review Deposit'}
          </ButtonStyled>
        ) : (
          <ButtonStyled>Please Connect Wallet</ButtonStyled>
        )}

        {/*  */}
        <PoweredBy />
      </div>
    </BoxContainer>
  );
}

export default Bridge;

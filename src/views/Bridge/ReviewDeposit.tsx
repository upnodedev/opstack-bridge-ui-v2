import BoxContainer from '@/components/Box/BoxContainer';
import ButtonStyled from '@/components/Button/ButtonStyled';
import CheckBoxList from '@/components/Form/CheckBoxList';
import { useUsdtPrice } from '@/contexts/UsdtPriceContext';
import useDeposit from '@/hooks/useDeposit';
import { useL1PublicClient } from '@/hooks/useL1PublicClient';
import { useAppDispatch } from '@/states/hooks';
import { closeModalAll } from '@/states/modal/reducer';
import { increaseRefresh } from '@/states/refresh/reducer';
import { l1Chain, l2Chain } from '@/utils/chain';
import { Token } from '@/utils/opType';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useState } from 'react';
import styled from 'styled-components';
import { formatEther } from 'viem';
import { useAccount } from 'wagmi';

interface Props extends SimpleComponent {
  amount: string | undefined;
  selectedTokenPair: [Token, Token];
  l1: typeof l1Chain;
  l2: typeof l2Chain;
}

const ReviewDepositWrapper = styled.div``;

function ReviewDeposit({ amount, l1, l2, selectedTokenPair }: Props) {
  const usdtPrice = useUsdtPrice(l1.nativeCurrency.symbol);
  const { address } = useAccount();
  const { gasPrice, txHash, onSubmitDeposit } = useDeposit({
    address,
    amount: amount,
    selectedTokenPair: selectedTokenPair,
  });
  const [confirm, setConfirm] = useState(false);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const onAllSelected = (selected: boolean) => {
    setConfirm(selected);
  };

  const { l1PublicClient } = useL1PublicClient();

  const submitDeposit = async () => {
    setLoading(true);
    try {
      const hash = await onSubmitDeposit();
      if (!hash) {
        setLoading(false);
        return;
      }
      await l1PublicClient.waitForTransactionReceipt({
        hash,
      });

      dispatch(increaseRefresh());
      dispatch(closeModalAll());
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <ReviewDepositWrapper>
      <BoxContainer height="auto">
        <div className="flex flex-col gap-4">
          <h1 className="text-gray-900 text-lg font-semibold">
            Review Transection
          </h1>
          <p>
            This usually takes <span className="text-red-500">7 days</span>{' '}
            Bridge any token to {l2.name}
          </p>

          <div className="w-full rounded-2xl border-[1px] border-gray-200 bg-gray-100 py-1 px-4 relative">
            <div className="flex items-center py-2 justify-between gap-2 border-b-[1px] border-gray-200 font-semibold">
              <div className="flex gap-4">
                <Icon
                  icon={'icon-park-outline:double-down'}
                  fontSize={'1.2rem'}
                  className="text-primary"
                />
                <p className="text-gray-600">Initiate deposit fees</p>
              </div>
              <div className="text-primary">
                ~{' '}
                {usdtPrice
                  ? (+formatEther(gasPrice) * usdtPrice).toFixed(4)
                  : 0}{' '}
                $
              </div>
            </div>

            <div className="flex items-center py-2 justify-between gap-2 border-b-[1px] border-gray-200 font-semibold">
              <div className="flex gap-4">
                <Icon
                  icon={'mingcute:time-fill'}
                  fontSize={'1.2rem'}
                  className="text-yellow-500"
                />
                <p className="text-gray-600">Wait ~ 3 mins</p>
              </div>
            </div>

            <div className="flex items-center py-2 justify-between gap-2 font-semibold">
              <div className="flex gap-4">
                <Icon
                  icon={'ep:success-filled'}
                  fontSize={'1.2rem'}
                  className="text-green-500"
                />
                <p className="text-gray-600">Recieve on {l2.name}</p>
              </div>
              <div className="text-primary">
                {amount} {l1.nativeCurrency.symbol}
              </div>
            </div>
          </div>

          {/*  */}
          <CheckBoxList
            items={[
              `I understand it will take a few minutes until my funds are claimable on [${l2Chain.name}].`,
              `I understand once a deposit is initiated it cannot be sped up or cancelled`,
              `I understand network fees are approximate and will change`,
            ]}
            onAllSelected={onAllSelected}
          />

          <ButtonStyled
            disabled={!confirm || !!txHash}
            onClick={submitDeposit}
            loading={loading}
          >
            Initiate deposit
          </ButtonStyled>
        </div>
      </BoxContainer>
    </ReviewDepositWrapper>
  );
}

export default ReviewDeposit;

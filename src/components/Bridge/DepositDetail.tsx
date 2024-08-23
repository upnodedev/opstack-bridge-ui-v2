import { useUsdtPrice } from '@/contexts/UsdtPriceContext';
import useDeposit from '@/hooks/useDeposit';
import { shortenAddress } from '@/utils';
import ENV from '@/utils/ENV';
import { Token } from '@/utils/opType';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Chain, formatEther } from 'viem';
import { useAccount } from 'wagmi';

interface Props extends SimpleComponent {
  l1: Chain;
  l2: Chain;
  amount: string | undefined;
  selectedTokenPair: [Token, Token];
}

function DepositDetail({ l1, l2, amount, selectedTokenPair }: Props) {
  const { address } = useAccount();
  const usdtPrice = useUsdtPrice(l1.nativeCurrency.symbol);
  const { gasPrice } = useDeposit({
    amount: amount,
    selectedTokenPair: selectedTokenPair,
  });

  return (
    <div className="w-full rounded-2xl border-[1px] border-gray-300 bg-gray-100 py-1 px-4 relative">
      <div className="flex items-center py-2 justify-between gap-2 border-b-[1px] border-gray-300">
        <div className="flex">
          <Icon
            icon={'icon-park-outline:double-down'}
            fontSize={'1.5rem'}
            className="text-primary"
          />
          <p>To Address </p>
        </div>
        <div className="text-primary">
          <p>{shortenAddress(address || '')}</p>
        </div>
      </div>

      <div className="flex items-center py-2 justify-between gap-2 border-b-[1px] border-gray-300">
        <div className="flex">
          <Icon
            icon={'icon-park-outline:double-down'}
            fontSize={'1.5rem'}
            className="text-primary"
          />
          <p>Recieve on</p>
        </div>
        <div className="text-primary">
          <p>{l2.name}</p>
        </div>
      </div>

      <div className="flex items-center py-2 justify-between gap-2 border-b-[1px] border-gray-300">
        <div className="flex">
          <Icon
            icon={'icon-park-outline:double-down'}
            fontSize={'1.5rem'}
            className="text-primary"
          />
          <p>Transfer Time </p>
        </div>
        <div className="text-primary">
          <p>~3 mins</p>
        </div>
      </div>

      <div className="flex items-center py-2 justify-between gap-2">
        <div className="flex">
          <Icon
            icon={'icon-park-outline:double-down'}
            fontSize={'1.5rem'}
            className="text-primary"
          />
          <p>Network fees </p>
        </div>
        <div className="text-primary">
          <p>
            ~ {usdtPrice ? (+formatEther(gasPrice) * usdtPrice).toFixed(4) : 0}$
          </p>
        </div>
      </div>
    </div>
  );
}

export default DepositDetail;

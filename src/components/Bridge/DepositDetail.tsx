import ENV from '@/utils/ENV';
import { Icon } from '@iconify/react/dist/iconify.js';

interface Props extends SimpleComponent {}

function DepositDetail(props: Props) {
  return (
    <div className="w-full rounded-2xl border-[1px] border-gray-300 bg-gray-100 py-1 px-4 relative">
      <div className="flex items-center py-2 justify-between gap-2 border-b-[1px] border-gray-300">
        <div className="flex">
          <Icon
            icon={'icon-park-outline:double-down'}
            fontSize={'1.5rem'}
            className="text-primary"
          />
          <p>Bal : 20,000 {ENV.L1_NATIVE_CURRENCY_SYMBOL} </p>
        </div>
        <div className="text-primary">
          <p>xxxx</p>
        </div>
      </div>

      <div className="flex items-center py-2 justify-between gap-2 border-b-[1px] border-gray-300">
        <div className="flex">
          <Icon
            icon={'icon-park-outline:double-down'}
            fontSize={'1.5rem'}
            className="text-primary"
          />
          <p>Bal : 20,000 {ENV.L1_NATIVE_CURRENCY_SYMBOL} </p>
        </div>
        <div className="text-primary">
          <p>xxxx</p>
        </div>
      </div>

      <div className="flex items-center py-2 justify-between gap-2 border-b-[1px] border-gray-300">
        <div className="flex">
          <Icon
            icon={'icon-park-outline:double-down'}
            fontSize={'1.5rem'}
            className="text-primary"
          />
          <p>Bal : 20,000 {ENV.L1_NATIVE_CURRENCY_SYMBOL} </p>
        </div>
        <div className="text-primary">
          <p>xxxx</p>
        </div>
      </div>

      <div className="flex items-center py-2 justify-between gap-2">
        <div className="flex">
          <Icon
            icon={'icon-park-outline:double-down'}
            fontSize={'1.5rem'}
            className="text-primary"
          />
          <p>Bal : 20,000 {ENV.L1_NATIVE_CURRENCY_SYMBOL} </p>
        </div>
        <div className="text-primary">
          <p>xxxx2</p>
        </div>
      </div>
    </div>
  );
}

export default DepositDetail;

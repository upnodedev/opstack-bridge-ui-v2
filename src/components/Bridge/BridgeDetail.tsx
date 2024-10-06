import { useUsdtPrice } from "@/contexts/UsdtPriceContext";
import useDeposit from "@/hooks/useDeposit";
import useWithdrawal from "@/hooks/useWithdrawal";
import { formatSecsString, shortenAddress } from "@/utils";
import ENV from "@/utils/ENV";
import { Token } from "@/utils/opType";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ReactNode } from "react";
import { Chain, formatEther } from "viem";
import { useAccount } from "wagmi";

interface Props extends SimpleComponent {
  l1: Chain;
  l2: Chain;
  amount: string | undefined;
  selectedTokenPair: [Token, Token];
  type: "withdrawal" | "deposit";
}

interface BridgeDetailItemProps {
  icon: string;
  title: string;
  detail: ReactNode;
}
const BridgeDetailItem = ({ title, detail, icon }: BridgeDetailItemProps) => {
  return (
    <div className="flex items-center py-2 justify-between gap-2 border-b-[1px] border-gray-300">
      <div className="flex items-center gap-2">
        <div className="rounded-full p-1.5 bg-[#F2F4F7] border border-[#E4E7EC]">
          <Icon icon={icon} fontSize={"1.5rem"} className="text-primary" />
        </div>

        <p className="text-[#475467] text-sm font-semibold">{title}</p>
      </div>
      <div className="text-primary font-semibold text-sm">{detail}</div>
    </div>
  );
};
function BridgeDetail({ l1, l2, amount, selectedTokenPair, type }: Props) {
  const { address } = useAccount();
  const usdtPrice = useUsdtPrice(l1.nativeCurrency.symbol);
  const { gasPrice: gasPriceDeposit } = useDeposit({
    amount: amount,
    selectedTokenPair: selectedTokenPair,
    address,
  });
  const { gasPrice: gasPriceWithdrawal } = useWithdrawal({
    amount: amount,
    selectedTokenPair: selectedTokenPair,
    address,
  });

  const getTransferTime = () => {
    if (type === "deposit") {
      return formatSecsString(ENV.STATE_ROOT_PERIOD);
    } else {
      const transferTimeTimeSecs =
        ENV.WITHDRAWAL_PERIOD + ENV.STATE_ROOT_PERIOD;
      return formatSecsString(transferTimeTimeSecs);
    }
  };

  const getGasPrice = () => {
    if (type === "deposit") {
      return gasPriceDeposit;
    } else {
      return gasPriceWithdrawal;
    }
  };

  return (
    <div className="w-full rounded-2xl border-[1px] border-[#E4E7EC] bg-[#F9FAFB] px-4 relative">
      <BridgeDetailItem
        icon="lucide:send"
        title="To Address"
        detail={
          <div className="flex gap-1.5 items-center">
            <p>{shortenAddress(address || "")}</p>
            <Icon icon="lucide:edit" />
          </div>
        }
      />
      <BridgeDetailItem
        icon="lucide:route"
        title={`Receive on ${l2.name}`}
        detail={<p>{l2.name}</p>}
      />
      <BridgeDetailItem
        icon="lucide:clock-4"
        title="Transfer Time"
        detail={<p>~ {getTransferTime()}</p>}
      />
      <BridgeDetailItem
        icon="lucide:banknote"
        title="Network fees"
        detail={
          <p>
            ~{" "}
            {usdtPrice
              ? (+formatEther(getGasPrice()) * usdtPrice).toFixed(4)
              : 0}
            $
          </p>
        }
      />
    </div>
  );
}

export default BridgeDetail;

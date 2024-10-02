import { default as ETH } from "@/assets/eth.svg";
import BoxContainer from "@/components/Box/BoxContainer";
import DepositDetail from "@/components/Bridge/BridgeDetail";
import ChainBox from "@/components/Bridge/ChainBox";
import ButtonStyled from "@/components/Button/ButtonStyled";
import PoweredBy from "@/components/PoweredBy";
import { useUsdtPrice } from "@/contexts/UsdtPriceContext";
import { useIsNetworkUnsupported } from "@/hooks/useIsNetworkUnsupported";
import { useReadBalance } from "@/hooks/useReadBalance";
import { useSwitchNetworkDirection } from "@/hooks/useSwitchNetworkPair";
import { useAppDispatch, useAppSelector } from "@/states/hooks";
import { openPage } from "@/states/layout/reducer";
import { openModal } from "@/states/modal/reducer";
import { l1Chain, l2Chain } from "@/utils/chain";
import ENV from "@/utils/ENV";
import { Token } from "@/utils/opType";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { formatEther, parseEther } from "viem";
import { useAccount } from "wagmi";

interface Props extends SimpleComponent {
  amount: string | undefined;
  onAmountChange: (e: any) => void;
  selectedTokenPair: [Token, Token];
  l1: typeof l1Chain;
  l2: typeof l2Chain;
}

function Bridge({ amount, onAmountChange, selectedTokenPair, l1, l2 }: Props) {
  const { chain } = useAccount();
  const dispatch = useAppDispatch();
  const [type, setType] = useState<"withdrawal" | "deposit">("deposit");
  const [validationError, setValidationError] = useState<string | undefined>(
    undefined
  );

  const withdrawalNeed = useAppSelector(
    (state) => state.transactions.withdrawalNeed
  );

  const idelFetch = useAppSelector((state) => state.transactions.counter);

  const [l1Token] = selectedTokenPair;

  const onClickMode = (mode: "withdrawal" | "deposit") => {
    onAmountChange({ target: { value: "" } });
    setType(mode);
  };

  const onClickMax = () => {
    onAmountChange({ target: { value: (+balanceEth).toFixed(4) } });
  };

  const balance = useReadBalance({
    chain: type === "deposit" ? l1 : l2,
    // chain: l1,
    selectedToken: l1Token,
  });

  const balanceEth = balance.data.value ? formatEther(balance.data.value) : 0;

  useEffect(() => {
    if (typeof amount === "undefined" || amount === "") {
      setValidationError("Please enter amount");
      return;
    }

    const bigAmount = parseEther(amount);
    if (balance && bigAmount > balance.data.value) {
      setValidationError("Insufficent Balance");
      return;
    }

    setValidationError("");
    return;
  }, [amount, balance]);

  const reviewDeposit = () => {
    if (type === "deposit") {
      dispatch(openModal("reviewDeposit"));
    } else {
      dispatch(openModal("reviewWithdrawal"));
    }
  };

  const openTranaction = () => {
    dispatch(openPage("transaction"));
  };

  const usdtPrice = useUsdtPrice(l1.nativeCurrency.symbol);

  const { switchNetworkPair: switchToL1 } = useSwitchNetworkDirection({
    direction: "l1",
  });
  const { switchNetworkPair: switchToL2 } = useSwitchNetworkDirection({
    direction: "l2",
  });
  const { isUnsupported } = useIsNetworkUnsupported();

  const ConfirmButton = () => {
    const shouldDisableReview =
      parseEther(amount ?? "0") <= 0 || !!validationError;

    if (isUnsupported) {
      return (
        <ButtonStyled color="red" disabled>
          Unsupported Network
        </ButtonStyled>
      );
    }

    if (!chain) {
      return (
        <ButtonStyled disabled={true} className="rounded-full">
          Connect Wallet
        </ButtonStyled>
      );
    }
    if (type === "deposit" && l1.id !== chain?.id) {
      return (
        <ButtonStyled onClick={() => switchToL1()}>
          Switch to {l1.name}
        </ButtonStyled>
      );
    }

    if (type === "withdrawal" && l2.id !== chain?.id) {
      return (
        <ButtonStyled onClick={() => switchToL2()}>
          Switch to {l2.name}
        </ButtonStyled>
      );
    }

    return (
      <ButtonStyled disabled={!!shouldDisableReview} onClick={reviewDeposit}>
        {validationError
          ? validationError
          : type === "deposit"
          ? "Review Deposit"
          : "Withdraw"}
      </ButtonStyled>
    );
  };

  return (
    <BoxContainer>
      <div className="flex flex-col gap-5">
        {/*  */}
        <div className="flex justify-between items-start">
          <div className="flex border-[1px] border-[#E4E7EC] bg-[#F9FAFB] rounded-full p-1 gap-1 text-sm font-semibold">
            <button
              className={`w-[8rem] py-2 px-3 bg-transparent transition-all rounded-full border-[1px] ${
                type === "deposit"
                  ? "text-primary border-primary bg-white"
                  : "text-gray-600 border-transparent"
              }`}
              onClick={() => onClickMode("deposit")}
            >
              Deposit
            </button>
            <button
              className={`w-[8rem] py-2 px-3 bg-transparent transition-all rounded-full border-[1px] ${
                type === "withdrawal"
                  ? "text-primary border-primary bg-white"
                  : "text-gray-600 border-transparent"
              }`}
              onClick={() => onClickMode("withdrawal")}
            >
              Withdraw
            </button>
          </div>

          <button
            onClick={openTranaction}
            className={`py-2 px-3 bg-transparent transition-all rounded-full border-[1px] text-primary font-semibold border-[#90C5FF] shadow-sm text-center bg-white flex items-center justify-center gap-2 hover:bg-slate-100`}
          >
            Activity
            {idelFetch === 0 && <Icon icon="line-md:loading-twotone-loop" />}
            {withdrawalNeed.length > 0 && (
              <div className="animate-bounce w-5 h-5 flex items-center justify-center text-center rounded-full bg-red-500 text-white text-xs">
                {withdrawalNeed.length}
              </div>
            )}
          </button>
        </div>

        <ChainBox type={type} />

        {/*  */}
        <div className="w-full rounded-[20px] border-[1px] border-[#E4E7EC] bg-[#F9FAFB] flex items-center p-4 relative gap-5">
          <div className="flex flex-col flex-1">
            <input
              className={`w-full text-display-md text-left font-semibold text-[#101828] outline-none bg-transparent`}
              placeholder="0.0"
              type="number"
              autoFocus={true}
              maxLength={80}
              min={0}
              value={amount ? amount : ""}
              onChange={onAmountChange}
            />
            <span className="text-[#475467] text-sm font-medium mt-2 h-6">
              {usdtPrice && amount
                ? `$${(usdtPrice * +amount).toFixed(8)}`
                : ""}
            </span>
          </div>
          <div className="">
            <div className="flex items-center justify-between bg-primary rounded-full px-3 py-2 gap-1">
              <div className="flex items-center gap-2">
                <div className="w-[1.5rem] h-[1.5rem] p-1 rounded-full bg-white">
                  <img
                    src={ETH}
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
                  icon={"icon-park-outline:down"}
                  fontSize={"1.5rem"}
                  className="text-white"
                />
              </div>
            </div>
            <p className="mt-2 text-[#475467] text-sm font-medium">
              Bal :{" "}
              <b className="text-[#101828]">
                {balanceEth ? (+balanceEth).toFixed(4) : 0}{" "}
                {ENV.L1_NATIVE_CURRENCY_SYMBOL}
              </b>
              <span
                className="text-primary font-semibold ml-2 cursor-pointer"
                onClick={onClickMax}
              >
                Max
              </span>
            </p>
          </div>
        </div>

        <DepositDetail
          l1={l1}
          l2={l2}
          amount={amount}
          selectedTokenPair={selectedTokenPair}
          type={type}
        />

        <ConfirmButton />

        {/*  */}
        <PoweredBy />
      </div>
    </BoxContainer>
  );
}

export default Bridge;

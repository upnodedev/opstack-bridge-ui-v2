import { Icon } from "@iconify/react";
interface StatusBadgeProps {
  status?:
    | "waiting-to-prove"
    | "ready-to-prove"
    | "waiting-to-finalize"
    | "ready-to-finalize"
    | "finalized"
    | "success"
    | "reverted"
    | undefined
    | "unknown"
    | ""
    | "pending";

  noIcon?: boolean;
}
export const StatusBadge = ({ status, noIcon }: StatusBadgeProps) => {
  if (status === "waiting-to-prove") {
    return (
      <div className="flex gap-2 rounded-full border border-yellow-300 bg-yellow-50 px-2 py-0.5 text-yellow-700 font-medium">
        {!noIcon && <Icon icon="line-md:loading-twotone-loop" />}
        <div className="text-xs min-w-[6rem] text-center">Waiting to prove</div>
      </div>
    );
  }

  if (status === "ready-to-prove") {
    return (
      <div className="flex gap-2 rounded-full border border-green-300 bg-green-50 px-2 py-0.5 text-green-700 font-medium">
        {!noIcon && <Icon icon="icon-park-solid:transaction-order" />}
        <div className="text-xs min-w-[6rem] text-center">Ready to prove</div>
      </div>
    );
  }

  if (status === "waiting-to-finalize") {
    return (
      <div className="flex gap-2 rounded-full border border-yellow-300 bg-yellow-50 px-2 py-0.5 text-yellow-700 font-medium">
        {!noIcon && <Icon icon="line-md:loading-twotone-loop" />}
        <div className="text-xs min-w-[6rem] text-center">Waiting to finalize</div>
      </div>
    );
  }

  if (status === "ready-to-finalize") {
    return (
      <div className="flex gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-emerald-700 font-medium">
        {!noIcon && <Icon icon="icon-park-solid:transaction-order" />}
        <div className="text-xs min-w-[6rem] text-center">Ready to finalize</div>
      </div>
    );
  }

  if (status === "finalized") {
    return (
      <div className="flex gap-2 rounded-full border border-blue-300 bg-blue-50 px-2 py-0.5 text-blue-700 font-medium">
        {!noIcon && <Icon icon="line-md:confirm-circle-twotone" />}
        <div className="text-xs min-w-[6rem] text-center">Finalized</div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-emerald-700 font-medium">
        {!noIcon && <Icon icon="line-md:confirm-circle-twotone" />}
        <div className="text-xs min-w-[6rem] text-center">Success</div>
      </div>
    );
  }

  if (status === "reverted") {
    return (
      <div className="flex gap-2 rounded-full border border-red-300 bg-red-50 px-2 py-0.5 text-red-700 font-medium">
        {!noIcon && <Icon icon="mdi:error" />}
        <div className="text-xs min-w-[6rem] text-center">Reverted</div>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="flex gap-2 rounded-full border border-gray-300 bg-gray-50 px-2 py-0.5 text-gray-700 font-medium">
        {!noIcon && <Icon icon="line-md:loading-twotone-loop" />}
        <div className="text-xs min-w-[6rem] text-center">Pending</div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 rounded-full border border-gray-300 bg-gray-50 px-2 py-0.5 text-gray-700 font-medium">
      {!noIcon && <Icon icon="carbon:unknown-filled" />}
      <div className="text-xs min-w-[6rem] text-center">Unknown</div>
    </div>
  );
};

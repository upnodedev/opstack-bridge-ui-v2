function PoweredBy() {
  return (
    <div className="w-full flex justify-center gap-2 items-center">
      <span className="text-[#667085] text-xs font-semibold">Powered by</span>
      <img src={`/logo.svg`} alt="" className="object-contain h-[2rem]" />
    </div>
  );
}

export default PoweredBy;

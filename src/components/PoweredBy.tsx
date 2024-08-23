import ENV from '@/utils/ENV';

function PoweredBy() {
  return (
    <div className="w-full flex justify-center gap-2 items-center">
      <span className="text-gray-600">Powered by</span>
      <b className="text-primary">{ENV.APP_NAME}</b>
      <img
        src={`${ENV.APP_LOGO}`}
        alt=""
        className="object-contain h-[2rem] w-[2rem]"
      />
    </div>
  );
}

export default PoweredBy;

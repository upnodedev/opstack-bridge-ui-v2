export const ERC20_DEPOSIT_MIN_GAS_LIMIT = 200_000;
export const MAX_ALLOWANCE = BigInt(
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
); // max uint256

export function shortenAddress(
  address: string,
  startLength = 6,
  endLength = 4
) {
  if (!address) return '...';
  if (
    typeof address !== 'string' ||
    address.length <= startLength + endLength
  ) {
    return address;
  }

  const start = address.slice(0, startLength);
  const end = address.slice(-endLength);

  return `${start}...${end}`;
}

export function formatSecsString(secs: number) {
  // pass to days and hours and minutes
  const days = Math.floor(secs / 86400);
  const hours = Math.floor((secs % 86400) / 3600);
  const minutes = Math.floor((secs % 3600) / 60);

  // return formatted string with days, hours and minutes if they are greater than 1 else return empty string for that unit of time days or hours or minutes

  return `${days >= 1 ? (days === 1 ? '1 day' : `${days} Days`) : ''} ${
    hours >= 1 ? (hours === 1 ? '1 hour' : `${hours} hours`) : ''
  } ${minutes >= 1 ? (minutes === 1 ? '1 min' : `${minutes} mins`) : ''}`;
}

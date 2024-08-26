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


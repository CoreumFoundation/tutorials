export function convertMicroDenomToDenom(amount: number | string) {
  if (typeof amount === 'string') {
    amount = Number(amount);
  }
  amount = amount / 1000000;
  return isNaN(amount) ? 0 : amount;
}

export function convertDenomToMicroDenom(amount: number | string): string {
  if (typeof amount === 'string') {
    amount = Number(amount);
  }
  amount = amount * 1000000;
  return isNaN(amount) ? '0' : String(amount);
}

export function convertFromMicroDenom(denom: string) {
  return denom?.substring(1).toUpperCase();
}

export const shortAddress = (addr: string) => {
  let shorted = `${addr.slice(0, 4)}...${addr.slice(-4, addr.length)}`;
  return shorted;
};

export enum CardBrand {
  VISA = 'VISA',
  MASTERCARD = 'MASTERCARD',
  UNKNOWN = 'UNKNOWN',
}

export const detectCardBrand = (cardNumber: string): CardBrand => {
  const digits = cardNumber.replace(/\s/g, '');
  if (/^4/.test(digits)) return CardBrand.VISA;
  if (/^5[1-5]/.test(digits)) return CardBrand.MASTERCARD;
  const prefix4 = parseInt(digits.substring(0, 4), 10);
  if (prefix4 >= 2221 && prefix4 <= 2720) return CardBrand.MASTERCARD;
  return CardBrand.UNKNOWN;
};

export const isValidLuhn = (cardNumber: string): boolean => {
  const digits = cardNumber.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(digits)) return false;
  let sum = 0;
  let alternate = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
};

import { CardBrand, detectCardBrand, isValidLuhn } from './CardBrand';

describe('detectCardBrand()', () => {
  it('returns VISA for numbers starting with 4', () => {
    expect(detectCardBrand('4242424242424242')).toBe(CardBrand.VISA);
  });

  it('returns MASTERCARD for 51xxxx prefix', () => {
    expect(detectCardBrand('5100000000000000')).toBe(CardBrand.MASTERCARD);
  });

  it('returns MASTERCARD for 55xxxx prefix', () => {
    expect(detectCardBrand('5500005555555559')).toBe(CardBrand.MASTERCARD);
  });

  it('returns MASTERCARD for 2221–2720 prefix range', () => {
    expect(detectCardBrand('2221000000000000')).toBe(CardBrand.MASTERCARD);
    expect(detectCardBrand('2720000000000000')).toBe(CardBrand.MASTERCARD);
  });

  it('returns UNKNOWN for unrecognized prefix', () => {
    expect(detectCardBrand('6011000000000000')).toBe(CardBrand.UNKNOWN);
  });

  it('ignores spaces when detecting brand', () => {
    expect(detectCardBrand('4242 4242 4242 4242')).toBe(CardBrand.VISA);
  });
});

describe('isValidLuhn()', () => {
  it('returns true for valid VISA test card 4242424242424242', () => {
    expect(isValidLuhn('4242424242424242')).toBe(true);
  });

  it('returns true for valid Mastercard test card 5500005555555559', () => {
    expect(isValidLuhn('5500005555555559')).toBe(true);
  });

  it('returns false for a number with wrong check digit', () => {
    expect(isValidLuhn('4242424242424241')).toBe(false);
  });

  it('returns false when number is too short (< 13 digits)', () => {
    expect(isValidLuhn('424242')).toBe(false);
  });

  it('returns true when number contains spaces (stripped before check)', () => {
    expect(isValidLuhn('4242 4242 4242 4242')).toBe(true);
  });
});

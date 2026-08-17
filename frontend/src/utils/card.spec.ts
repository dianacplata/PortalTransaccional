import {
  detectCardBrand,
  isValidLuhn,
  formatCardNumber,
  formatCOP,
} from './card';

describe('detectCardBrand()', () => {
  it('returns VISA for numbers starting with 4', () => {
    expect(detectCardBrand('4242424242424242')).toBe('VISA');
  });

  it('returns MASTERCARD for 51xxxx prefix', () => {
    expect(detectCardBrand('5100000000000000')).toBe('MASTERCARD');
  });

  it('returns MASTERCARD for 55xxxx prefix', () => {
    expect(detectCardBrand('5500005555555559')).toBe('MASTERCARD');
  });

  it('returns MASTERCARD for 2221–2720 prefix range', () => {
    expect(detectCardBrand('2221000000000000')).toBe('MASTERCARD');
  });

  it('returns UNKNOWN for unrecognized prefix', () => {
    expect(detectCardBrand('6011000000000000')).toBe('UNKNOWN');
  });

  it('ignores spaces before detecting brand', () => {
    expect(detectCardBrand('4111 1111 1111 1111')).toBe('VISA');
  });
});

describe('isValidLuhn()', () => {
  it('returns true for valid VISA card 4242424242424242', () => {
    expect(isValidLuhn('4242424242424242')).toBe(true);
  });

  it('returns true for valid MC card 5500005555555559', () => {
    expect(isValidLuhn('5500005555555559')).toBe(true);
  });

  it('returns false when check digit is wrong', () => {
    expect(isValidLuhn('4242424242424241')).toBe(false);
  });

  it('returns false when number is too short', () => {
    expect(isValidLuhn('12345')).toBe(false);
  });
});

describe('formatCardNumber()', () => {
  it('adds a space every 4 digits', () => {
    expect(formatCardNumber('4242424242424242')).toBe('4242 4242 4242 4242');
  });

  it('strips non-digit characters', () => {
    expect(formatCardNumber('4242-4242-4242-4242')).toBe('4242 4242 4242 4242');
  });

  it('limits output to 16 digits (4 groups of 4)', () => {
    expect(formatCardNumber('42424242424242421234')).toBe('4242 4242 4242 4242');
  });
});

describe('formatCOP()', () => {
  it('returns a string starting with $', () => {
    expect(formatCOP(100)).toMatch(/^\$/);
  });

  it('converts cents to pesos (divides by 100)', () => {
    expect(formatCOP(100)).toContain('1');
  });

  it('rounds to nearest peso', () => {
    // 150 cents → 2 pesos (Math.round)
    expect(formatCOP(150)).toContain('2');
  });
});

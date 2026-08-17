export type CardBrand = 'VISA' | 'MASTERCARD' | 'UNKNOWN';

/** Detecta la marca por prefijo BIN */
export const detectCardBrand = (number: string): CardBrand => {
  const digits = number.replace(/\s/g, '');
  if (/^4/.test(digits)) return 'VISA';
  if (/^5[1-5]/.test(digits)) return 'MASTERCARD';
  const prefix4 = parseInt(digits.substring(0, 4), 10);
  if (prefix4 >= 2221 && prefix4 <= 2720) return 'MASTERCARD';
  return 'UNKNOWN';
};

/** Algoritmo de Luhn */
export const isValidLuhn = (number: string): boolean => {
  const digits = number.replace(/\s/g, '');
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

/** Formatea el número de tarjeta con espacios cada 4 dígitos: "4242 4242 4242 4242" */
export const formatCardNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
};

/** Formatea centavos COP a string con separador de miles: "$89.000" */
export const formatCOP = (cents: number): string => {
  const pesos = Math.round(cents / 100);
  return `$${pesos.toLocaleString('es-CO')}`;
};

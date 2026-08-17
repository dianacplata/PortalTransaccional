import { useState } from 'react';
import { useAppDispatch } from '@/store';
import { saveCardData, type CardData } from '@/store/slices/checkoutSlice';
import { detectCardBrand, isValidLuhn, formatCardNumber } from '@/utils/card';
import type { CardBrand } from '@/utils/card';

function CardBrandBadge({ brand }: { brand: CardBrand }) {
  if (brand === 'VISA')
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-blue-700 text-white tracking-widest">
        VISA
      </span>
    );
  if (brand === 'MASTERCARD')
    return (
      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-xs font-bold bg-gray-900 text-white">
        <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
        <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block -ml-1.5" />
      </span>
    );
  return null;
}

function FieldError({ msg }: { msg: string }) {
  return <p className="mt-1 text-xs text-red-500">{msg}</p>;
}

export function CardForm() {
  const dispatch = useAppDispatch();

  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expMonth, setExpMonth]     = useState('');
  const [expYear, setExpYear]       = useState('');
  const [cvc, setCvc]               = useState('');
  const [installments, setInstallments] = useState(1);

  const [luhnError, setLuhnError]   = useState('');
  const [errors, setErrors]         = useState<Record<string, string>>({});

  const brand = detectCardBrand(cardNumber);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
    setLuhnError('');
  };

  const handleCardNumberBlur = () => {
    const raw = cardNumber.replace(/\s/g, '');
    if (raw.length > 0 && !isValidLuhn(raw)) {
      setLuhnError('Número de tarjeta inválido');
    }
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    const raw = cardNumber.replace(/\s/g, '');
    if (!raw) e.cardNumber = 'Ingresa el número de tarjeta';
    else if (!isValidLuhn(raw)) e.cardNumber = 'Número de tarjeta inválido';
    if (!cardHolder.trim()) e.cardHolder = 'Ingresa el nombre del titular';
    if (!/^(0[1-9]|1[0-2])$/.test(expMonth)) e.expMonth = 'MM inválido';
    if (!/^\d{2}$/.test(expYear)) e.expYear = 'AA inválido';
    if (!cvc || cvc.length < 3) e.cvc = 'CVV inválido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const data: CardData = {
      cardNumber: cardNumber.replace(/\s/g, ''),
      cardHolder: cardHolder.trim().toUpperCase(),
      expMonth,
      expYear,
      cvc,
      installments,
    };
    dispatch(saveCardData(data));
  };

  const inputCls = (field: string) =>
    `w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
      errors[field] ? 'border-red-400' : 'border-gray-300'
    }`;

  return (
    <form onSubmit={handleSubmit} noValidate className="p-4 space-y-4">
      {/* Número de tarjeta */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Número de tarjeta
        </label>
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            value={cardNumber}
            onChange={handleCardNumberChange}
            onBlur={handleCardNumberBlur}
            className={`${inputCls('cardNumber')} pr-16`}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            <CardBrandBadge brand={brand} />
          </span>
        </div>
        {(errors.cardNumber || luhnError) && (
          <FieldError msg={errors.cardNumber || luhnError} />
        )}
      </div>

      {/* Titular */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre en la tarjeta
        </label>
        <input
          type="text"
          placeholder="NOMBRE APELLIDO"
          value={cardHolder}
          onChange={e => setCardHolder(e.target.value)}
          className={inputCls('cardHolder')}
        />
        {errors.cardHolder && <FieldError msg={errors.cardHolder} />}
      </div>

      {/* Vencimiento + CVV */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">MM</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="12"
            maxLength={2}
            value={expMonth}
            onChange={e => setExpMonth(e.target.value.replace(/\D/g, ''))}
            className={inputCls('expMonth')}
          />
          {errors.expMonth && <FieldError msg={errors.expMonth} />}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">AA</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="28"
            maxLength={2}
            value={expYear}
            onChange={e => setExpYear(e.target.value.replace(/\D/g, ''))}
            className={inputCls('expYear')}
          />
          {errors.expYear && <FieldError msg={errors.expYear} />}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="123"
            maxLength={4}
            value={cvc}
            onChange={e => setCvc(e.target.value.replace(/\D/g, ''))}
            className={inputCls('cvc')}
          />
          {errors.cvc && <FieldError msg={errors.cvc} />}
        </div>
      </div>

      {/* Cuotas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cuotas</label>
        <select
          value={installments}
          onChange={e => setInstallments(Number(e.target.value))}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {[1, 2, 3, 6, 12, 18, 24, 36].map(n => (
            <option key={n} value={n}>
              {n === 1 ? '1 cuota (sin interés)' : `${n} cuotas`}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl transition-colors mt-2"
      >
        Continuar →
      </button>
    </form>
  );
}

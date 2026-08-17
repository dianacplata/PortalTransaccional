import { useState } from 'react';
import { useAppDispatch } from '@/store';
import { saveDeliveryData, type DeliveryData } from '@/store/slices/checkoutSlice';

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function DeliveryForm() {
  const dispatch = useAppDispatch();

  const [form, setForm] = useState<DeliveryData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: '',
    city: '',
    department: '',
    postalCode: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof DeliveryData, string>>>({});

  const set = (key: keyof DeliveryData) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value }));

  const validate = (): boolean => {
    const e: Partial<Record<keyof DeliveryData, string>> = {};
    if (form.customerName.trim().length < 2)  e.customerName  = 'Mínimo 2 caracteres';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail))
      e.customerEmail = 'Correo inválido';
    if (form.customerPhone.trim().length < 7)  e.customerPhone = 'Mínimo 7 dígitos';
    if (form.address.trim().length < 5)        e.address       = 'Dirección muy corta';
    if (form.city.trim().length < 2)           e.city          = 'Campo requerido';
    if (form.department.trim().length < 2)     e.department    = 'Campo requerido';
    if (form.postalCode.trim().length < 4)     e.postalCode    = 'Código inválido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(saveDeliveryData(form));
  };

  const inputCls = (field: keyof DeliveryData) =>
    `w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
      errors[field] ? 'border-red-400' : 'border-gray-300'
    }`;

  return (
    <form onSubmit={handleSubmit} noValidate className="p-4 space-y-4">
      {/* Sección cliente */}
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Datos personales
      </p>

      <Field label="Nombre completo" error={errors.customerName}>
        <input
          type="text"
          placeholder="María García"
          value={form.customerName}
          onChange={set('customerName')}
          className={inputCls('customerName')}
        />
      </Field>

      <Field label="Correo electrónico" error={errors.customerEmail}>
        <input
          type="email"
          placeholder="maria@example.com"
          value={form.customerEmail}
          onChange={set('customerEmail')}
          className={inputCls('customerEmail')}
        />
      </Field>

      <Field label="Teléfono" error={errors.customerPhone}>
        <input
          type="tel"
          inputMode="numeric"
          placeholder="3001234567"
          value={form.customerPhone}
          onChange={set('customerPhone')}
          className={inputCls('customerPhone')}
        />
      </Field>

      {/* Sección envío */}
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider pt-2">
        Dirección de envío
      </p>

      <Field label="Dirección" error={errors.address}>
        <input
          type="text"
          placeholder="Calle 100 # 20-30 Apto 401"
          value={form.address}
          onChange={set('address')}
          className={inputCls('address')}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Ciudad" error={errors.city}>
          <input
            type="text"
            placeholder="Bogotá"
            value={form.city}
            onChange={set('city')}
            className={inputCls('city')}
          />
        </Field>
        <Field label="Código postal" error={errors.postalCode}>
          <input
            type="text"
            inputMode="numeric"
            placeholder="110111"
            maxLength={10}
            value={form.postalCode}
            onChange={set('postalCode')}
            className={inputCls('postalCode')}
          />
        </Field>
      </div>

      <Field label="Departamento" error={errors.department}>
        <input
          type="text"
          placeholder="Cundinamarca"
          value={form.department}
          onChange={set('department')}
          className={inputCls('department')}
        />
      </Field>

      <button
        type="submit"
        className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl transition-colors mt-2"
      >
        Continuar →
      </button>
    </form>
  );
}

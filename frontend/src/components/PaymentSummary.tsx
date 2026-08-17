import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { resetCheckout, setTransactionCreated } from '@/store/slices/checkoutSlice';
import { transactionsApi } from '@/services/api';
import { formatCOP } from '@/utils/card';
import type { Product } from '@/types';

const BASE_FEE_CENTS     = parseInt(process.env['VITE_BASE_FEE_CENTS']     ?? '300000', 10);
const DELIVERY_FEE_CENTS = parseInt(process.env['VITE_DELIVERY_FEE_CENTS'] ?? '150000', 10);

interface PaymentSummaryProps {
  product: Product;
}

function SummaryRow({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className={`flex justify-between items-center ${bold ? 'font-semibold text-gray-900' : 'text-gray-600'} text-sm`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

export function PaymentSummary({ product }: PaymentSummaryProps) {
  const dispatch  = useAppDispatch();
  const navigate  = useNavigate();
  const { productId, quantity, cardData, deliveryData } = useAppSelector(s => s.checkout);

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const productTotal = product.priceCents * (quantity ?? 1);
  const total        = productTotal + BASE_FEE_CENTS + DELIVERY_FEE_CENTS;

  const handlePay = async () => {
    if (!productId || !cardData || !deliveryData) return;
    setLoading(true);
    setError(null);

    try {
      // 1. Crear transacción PENDING
      const createRes = await transactionsApi.create({
        productId,
        quantity: quantity ?? 1,
        customer: {
          name:  deliveryData.customerName,
          email: deliveryData.customerEmail,
          phone: deliveryData.customerPhone,
        },
        delivery: {
          address:    deliveryData.address,
          city:       deliveryData.city,
          department: deliveryData.department,
          postalCode: deliveryData.postalCode,
        },
      });

      const { transactionId, reference, baseFeeCents, deliveryFeeCents, totalAmountCents } =
        createRes.data;

      dispatch(
        setTransactionCreated({ transactionId, reference, fees: { baseFeeCents, deliveryFeeCents, totalAmountCents } }),
      );

      // 2. Procesar pago
      await transactionsApi.pay(transactionId, {
        cardNumber:   cardData.cardNumber,
        cardHolder:   cardData.cardHolder,
        expMonth:     cardData.expMonth,
        expYear:      cardData.expYear,
        cvc:          cardData.cvc,
        installments: cardData.installments,
      });

      // 3. Navegar al resultado
      dispatch(resetCheckout());
      navigate(`/result/${transactionId}`);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Error al procesar el pago. Intenta de nuevo.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5">
      <h3 className="font-semibold text-gray-900 text-base mb-4">Resumen del pago</h3>

      <div className="space-y-2.5">
        <SummaryRow
          label={`${product.name} × ${quantity}`}
          value={formatCOP(productTotal)}
        />
        <SummaryRow label="Fee base" value={formatCOP(BASE_FEE_CENTS)} />
        <SummaryRow label="Fee envío" value={formatCOP(DELIVERY_FEE_CENTS)} />
        <div className="border-t border-gray-200 pt-2.5">
          <SummaryRow label="Total" value={formatCOP(total)} bold />
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}

      <button
        onClick={handlePay}
        disabled={loading}
        className="mt-5 w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-300 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Procesando…
          </>
        ) : (
          'Pagar ahora'
        )}
      </button>
    </div>
  );
}

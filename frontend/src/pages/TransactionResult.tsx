import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchTransaction, clearTransaction } from '@/store/slices/transactionSlice';
import { fetchProducts } from '@/store/slices/productSlice';
import { resetCheckout } from '@/store/slices/checkoutSlice';
import { Spinner } from '@/components/Spinner';
import { formatCOP } from '@/utils/card';

export default function TransactionResult() {
  const { id }    = useParams<{ id: string }>();
  const dispatch  = useAppDispatch();
  const navigate  = useNavigate();
  const { transaction, loading, error } = useAppSelector(s => s.transaction);

  useEffect(() => {
    if (id) dispatch(fetchTransaction(id));
    return () => { dispatch(clearTransaction()); };
  }, [id, dispatch]);

  const handleReturn = () => {
    dispatch(resetCheckout());
    dispatch(fetchProducts()); // Refresca el stock actualizado
    navigate('/');
  };

  if (loading) return <Spinner />;

  return (
    <div className="min-h-dvh bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-2">
          <span className="text-2xl">🛍️</span>
          <h1 className="font-bold text-gray-900 text-lg">Portal Transaccional</h1>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Error de carga */}
          {error && !transaction && (
            <div className="p-6 text-center">
              <div className="text-5xl mb-3">⚠️</div>
              <p className="font-semibold text-gray-900 mb-1">No se pudo obtener el resultado</p>
              <p className="text-gray-500 text-sm mb-5">{error}</p>
              <button
                onClick={() => id && dispatch(fetchTransaction(id))}
                className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* APPROVED */}
          {transaction?.status === 'APPROVED' && (
            <>
              <div className="bg-green-50 py-8 flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl">
                  ✅
                </div>
                <h2 className="font-bold text-green-700 text-lg">¡Pago aprobado!</h2>
              </div>
              <div className="p-5 space-y-3">
                <DetailRow label="Referencia"    value={transaction.reference} />
                <DetailRow label="ID transacción" value={transaction.id} mono />
                {transaction.payTransactionId && (
                  <DetailRow label="ID pasarela" value={transaction.payTransactionId} mono />
                )}
                <DetailRow label="Total" value={formatCOP(transaction.totalAmountCents)} />
              </div>
            </>
          )}

          {/* DECLINED / ERROR / VOIDED */}
          {(transaction?.status === 'DECLINED' ||
            transaction?.status === 'ERROR' ||
            transaction?.status === 'VOIDED') && (
            <>
              <div className="bg-red-50 py-8 flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-3xl">
                  ❌
                </div>
                <h2 className="font-bold text-red-700 text-lg">
                  {transaction.status === 'DECLINED' ? 'Pago declinado' : 'Pago no procesado'}
                </h2>
                <p className="text-red-500 text-sm text-center px-4">
                  {transaction.status === 'DECLINED'
                    ? 'Tu banco rechazó la transacción. Verifica los datos de tu tarjeta e intenta de nuevo.'
                    : 'Ocurrió un error al procesar el pago. Intenta de nuevo más tarde.'}
                </p>
              </div>
              <div className="p-5">
                <DetailRow label="Referencia" value={transaction.reference} />
              </div>
            </>
          )}

          {/* PENDING */}
          {transaction?.status === 'PENDING' && (
            <div className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="font-semibold text-gray-900 mb-1">Pago en proceso</p>
              <p className="text-gray-500 text-sm mb-5">
                Tu pago se está procesando. Puedes refrescar para ver el resultado.
              </p>
              <button
                onClick={() => id && dispatch(fetchTransaction(id))}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Refrescar estado
              </button>
            </div>
          )}

          {/* Botón volver — siempre visible si hay transacción */}
          {transaction && transaction.status !== 'PENDING' && (
            <div className="px-5 pb-5">
              <button
                onClick={handleReturn}
                className="w-full py-3 border border-gray-300 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Volver a la tienda
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function DetailRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-gray-500">{label}</span>
      <span
        className={`text-sm text-gray-900 break-all ${mono ? 'font-mono text-xs' : 'font-medium'}`}
      >
        {value}
      </span>
    </div>
  );
}

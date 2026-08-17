import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchProducts } from '@/store/slices/productSlice';
import { goToStep } from '@/store/slices/checkoutSlice';
import { Modal } from '@/components/Modal';
import { Backdrop } from '@/components/Backdrop';
import { CardForm } from '@/components/CardForm';
import { DeliveryForm } from '@/components/DeliveryForm';
import { PaymentSummary } from '@/components/PaymentSummary';

export default function CheckoutPage() {
  const dispatch  = useAppDispatch();
  const navigate  = useNavigate();
  const { step, productId, quantity } = useAppSelector(s => s.checkout);
  const products  = useAppSelector(s => s.products.items);

  // Si no hay producto seleccionado, volver al inicio
  useEffect(() => {
    if (!productId) navigate('/', { replace: true });
  }, [productId, navigate]);

  // Asegurar que los productos estén cargados (necesario si el usuario llega por URL directa)
  useEffect(() => {
    if (products.length === 0) dispatch(fetchProducts());
  }, [dispatch, products.length]);

  const product = products.find(p => p.id === productId);

  if (!productId) return null;

  // Steps 2 y 3 — Modales a pantalla completa
  if (step === 2) {
    return (
      <Modal title="Datos de tarjeta" onClose={() => navigate('/')}>
        <CardForm />
      </Modal>
    );
  }

  if (step === 3) {
    return (
      <Modal title="Datos de envío" onClose={() => dispatch(goToStep(2))}>
        <DeliveryForm />
      </Modal>
    );
  }

  // Step 4 — Backdrop sobre imagen del producto (Material Design)
  if (step === 4) {
    return (
      <div className="fixed inset-0 bg-gray-900">
        {/* Fondo: imagen del producto */}
        {product ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800" />
        )}

        {/* Overlay oscuro sutil */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Info del producto visible sobre el fondo */}
        {product && (
          <div className="absolute top-0 left-0 right-0 px-5 pt-12 pb-4">
            <p className="text-white/80 text-xs font-medium uppercase tracking-wide">
              Comprando
            </p>
            <h2 className="text-white font-bold text-xl mt-0.5">{product.name}</h2>
            <p className="text-white/70 text-sm mt-0.5">
              Cantidad: {quantity}
            </p>
          </div>
        )}

        {/* Backdrop con el resumen */}
        <Backdrop onDismiss={() => dispatch(goToStep(3))}>
          {product ? (
            <PaymentSummary product={product} />
          ) : (
            <div className="p-5 text-center text-gray-500 text-sm">
              Cargando producto…
            </div>
          )}
        </Backdrop>
      </div>
    );
  }

  // Paso desconocido — redirige al inicio
  navigate('/', { replace: true });
  return null;
}

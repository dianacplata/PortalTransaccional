import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchProducts } from '@/store/slices/productSlice';
import { selectProduct } from '@/store/slices/checkoutSlice';
import { Spinner } from '@/components/Spinner';
import { formatCOP } from '@/utils/card';
import type { Product } from '@/types';

export default function ProductPage() {
  const dispatch  = useAppDispatch();
  const navigate  = useNavigate();
  const { items, loading, error } = useAppSelector(s => s.products);

  const [confirmProduct, setConfirmProduct] = useState<Product | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleConfirm = () => {
    if (!confirmProduct) return;
    dispatch(selectProduct({ productId: confirmProduct.id, quantity: 1 }));
    setConfirmProduct(null);
    navigate('/checkout');
  };

  if (loading && items.length === 0) return <Spinner />;

  return (
    <div className="min-h-dvh bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-2">
          <span className="text-2xl">🛍️</span>
          <h1 className="font-bold text-gray-900 text-lg">Tienda</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-5">
        {/* Error / vacío */}
        {error && (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <span className="text-4xl">😕</span>
            <p className="text-gray-500 text-sm">{error}</p>
            <button
              onClick={() => dispatch(fetchProducts())}
              className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {!error && items.length === 0 && !loading && (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <span className="text-4xl">📦</span>
            <p className="text-gray-500 text-sm">No hay productos disponibles.</p>
            <button
              onClick={() => dispatch(fetchProducts())}
              className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Catálogo */}
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map(product => (
            <article
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col"
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-44 object-cover"
                loading="lazy"
              />
              <div className="p-4 flex flex-col flex-1 gap-2">
                {/* Stock badge */}
                <span
                  className={`self-start text-xs font-medium px-2 py-0.5 rounded-full ${
                    product.stock > 5
                      ? 'bg-green-100 text-green-700'
                      : product.stock > 0
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                  }`}
                >
                  {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
                </span>

                <h2 className="font-semibold text-gray-900 text-sm leading-snug">
                  {product.name}
                </h2>
                <p className="text-gray-500 text-xs line-clamp-2 flex-1">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mt-1">
                  <span className="font-bold text-gray-900 text-base">
                    {formatCOP(product.priceCents)}
                  </span>
                  <button
                    disabled={product.stock === 0}
                    onClick={() => setConfirmProduct(product)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-300 text-white text-xs font-semibold rounded-xl transition-colors"
                  >
                    <span>💳</span> Pagar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Mini modal de confirmación */}
      {confirmProduct && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmProduct(null)} />
          <div className="relative bg-white rounded-2xl p-5 w-full max-w-sm shadow-xl animate-slide-in">
            <h3 className="font-semibold text-gray-900 mb-1">Confirmar compra</h3>
            <p className="text-gray-500 text-sm mb-4">
              ¿Continuar con <span className="font-medium text-gray-700">{confirmProduct.name}</span>{' '}
              por <span className="font-medium text-gray-700">{formatCOP(confirmProduct.priceCents)}</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmProduct(null)}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Continuar →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

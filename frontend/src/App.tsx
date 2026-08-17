import { Routes, Route, Navigate } from 'react-router-dom';
import ProductPage from './pages/ProductPage';
import CheckoutPage from './pages/CheckoutPage';
import TransactionResult from './pages/TransactionResult';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ProductPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/result/:id" element={<TransactionResult />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

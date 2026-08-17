import axios from 'axios';
import type {
  CreateTransactionPayload,
  CreateTransactionResponse,
  ProcessPaymentPayload,
  ProcessPaymentResponse,
  Product,
  Transaction,
} from '@/types';

// process.env['VITE_API_URL'] — compatible con Jest (CommonJS) y Vite (browser).
// Vite lo inyecta vía define en vite.config.ts; Jest lo lee de process.env directamente.
const BASE_URL = process.env['VITE_API_URL'] ?? 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const productsApi = {
  getAll: () => apiClient.get<Product[]>('/products'),
  getById: (id: string) => apiClient.get<Product>(`/products/${id}`),
};

export const transactionsApi = {
  create: (payload: CreateTransactionPayload) =>
    apiClient.post<CreateTransactionResponse>('/transactions', payload),

  pay: (id: string, payload: ProcessPaymentPayload) =>
    apiClient.post<ProcessPaymentResponse>(`/transactions/${id}/pay`, payload),

  getById: (id: string) => apiClient.get<Transaction>(`/transactions/${id}`),
};

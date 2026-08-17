import { transactionReducer, setTransaction, clearTransaction, fetchTransaction } from './transactionSlice';
import type { Transaction } from '@/types';

// Mock the api service to avoid import.meta issues in Jest
jest.mock('@/services/api', () => ({
  transactionsApi: {
    getById: jest.fn(),
  },
}));

const makeTx = (status: Transaction['status'] = 'PENDING'): Transaction => ({
  id: 'tx-1',
  productId: 'p-1',
  customerId: 'c-1',
  quantity: 1,
  productAmountCents: 500000,
  baseFeeCents: 300000,
  deliveryFeeCents: 150000,
  totalAmountCents: 950000,
  status,
  payTransactionId: null,
  reference: 'REF-001',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const initialState = { transaction: null, loading: false, error: null };

describe('transactionSlice', () => {
  it('returns initial state', () => {
    expect(transactionReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('setTransaction stores the transaction and clears error', () => {
    const tx = makeTx('APPROVED');
    const state = transactionReducer(initialState, setTransaction(tx));
    expect(state.transaction).toEqual(tx);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('clearTransaction resets to initial state', () => {
    const tx = makeTx('APPROVED');
    const withData = transactionReducer(initialState, setTransaction(tx));
    const state = transactionReducer(withData, clearTransaction());
    expect(state).toEqual(initialState);
  });

  it('sets loading=true on fetchTransaction.pending', () => {
    const action = fetchTransaction.pending('req-id', 'tx-1');
    const state = transactionReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('stores transaction and clears loading on fetchTransaction.fulfilled', () => {
    const tx = makeTx('APPROVED');
    const action = fetchTransaction.fulfilled(tx, 'req-id', 'tx-1');
    const state = transactionReducer({ ...initialState, loading: true }, action);
    expect(state.loading).toBe(false);
    expect(state.transaction).toEqual(tx);
  });

  it('stores error and clears loading on fetchTransaction.rejected', () => {
    const action = fetchTransaction.rejected(null, 'req-id', 'tx-1', 'Error al consultar la transacción');
    const state = transactionReducer({ ...initialState, loading: true }, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Error al consultar la transacción');
  });
});

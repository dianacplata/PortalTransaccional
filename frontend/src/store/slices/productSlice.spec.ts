import { productReducer, fetchProducts } from './productSlice';
import type { Product } from '@/types';

// Mock the api service to avoid import.meta issues in Jest
jest.mock('@/services/api', () => ({
  productsApi: {
    getAll: jest.fn(),
  },
}));

const makeProduct = (id = '1'): Product => ({
  id,
  name: `Product ${id}`,
  description: 'Desc',
  priceCents: 50000,
  stock: 10,
  imageUrl: 'https://example.com/img.jpg',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const initialState = { items: [], loading: false, error: null };

describe('productSlice', () => {
  it('returns initial state', () => {
    expect(productReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('sets loading=true and clears error on fetchProducts.pending', () => {
    const action = fetchProducts.pending('req-id', undefined);
    const state = productReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('stores products and clears loading on fetchProducts.fulfilled', () => {
    const products = [makeProduct('1'), makeProduct('2')];
    const action = fetchProducts.fulfilled(products, 'req-id', undefined);
    const state = productReducer({ ...initialState, loading: true }, action);
    expect(state.loading).toBe(false);
    expect(state.items).toHaveLength(2);
    expect(state.items[0].id).toBe('1');
  });

  it('stores error message and clears loading on fetchProducts.rejected', () => {
    const action = fetchProducts.rejected(null, 'req-id', undefined, 'Error al cargar los productos');
    const state = productReducer({ ...initialState, loading: true }, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Error al cargar los productos');
  });

  it('replaces existing items on second fulfilled dispatch', () => {
    const first = fetchProducts.fulfilled([makeProduct('1')], 'r1', undefined);
    const second = fetchProducts.fulfilled([makeProduct('2'), makeProduct('3')], 'r2', undefined);
    let state = productReducer(initialState, first);
    state = productReducer(state, second);
    expect(state.items).toHaveLength(2);
    expect(state.items[0].id).toBe('2');
  });

  it('preserves items when a subsequent fetch fails', () => {
    const fulfilled = fetchProducts.fulfilled([makeProduct('1')], 'r1', undefined);
    const rejected = fetchProducts.rejected(null, 'r2', undefined, 'Error al cargar los productos');
    let state = productReducer(initialState, fulfilled);
    state = productReducer(state, rejected);
    expect(state.items).toHaveLength(1);
    expect(state.error).toBe('Error al cargar los productos');
  });
});

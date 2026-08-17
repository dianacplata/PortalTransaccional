import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { productReducer } from './slices/productSlice';
import { checkoutReducer } from './slices/checkoutSlice';
import { transactionReducer } from './slices/transactionSlice';
import { localStorageMiddleware } from './middleware/localStorageMiddleware';

const rootReducer = combineReducers({
  products: productReducer,
  checkout: checkoutReducer,
  transaction: transactionReducer,
});

// RootState derivado del reducer (no del store) para evitar referencias circulares
export type RootState = ReturnType<typeof rootReducer>;

const loadCheckoutFromStorage = (): Partial<RootState> => {
  try {
    const raw = localStorage.getItem('checkout');
    if (!raw) return {};
    return { checkout: JSON.parse(raw) as RootState['checkout'] };
  } catch {
    return {};
  }
};

export const store = configureStore({
  reducer: rootReducer,
  // Rehidrata el checkout desde localStorage al arrancar (resiliencia ante refresh)
  preloadedState: loadCheckoutFromStorage(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export type AppDispatch = typeof store.dispatch;

// Hooks tipados — usar en lugar de useDispatch/useSelector genéricos
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector);

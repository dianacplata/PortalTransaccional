import type { Middleware } from '@reduxjs/toolkit';

/** Persiste el estado de checkout en localStorage tras cada acción */
export const localStorageMiddleware: Middleware =
  (store) => (next) => (action) => {
    const result = next(action);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { checkout } = store.getState() as { checkout: unknown };
    try {
      localStorage.setItem('checkout', JSON.stringify(checkout));
    } catch {
      // Storage lleno — ignorar
    }
    return result;
  };

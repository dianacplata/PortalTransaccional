import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { transactionsApi } from '@/services/api';
import type { Transaction } from '@/types';

interface TransactionState {
  transaction: Transaction | null;
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  transaction: null,
  loading: false,
  error: null,
};

export const fetchTransaction = createAsyncThunk(
  'transaction/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await transactionsApi.getById(id);
      return res.data;
    } catch {
      return rejectWithValue('Error al consultar la transacción');
    }
  },
);

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setTransaction(state, action: PayloadAction<Transaction>) {
      state.transaction = action.payload;
      state.loading = false;
      state.error = null;
    },
    clearTransaction() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transaction = action.payload;
      })
      .addCase(fetchTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setTransaction, clearTransaction } = transactionSlice.actions;
export const transactionReducer = transactionSlice.reducer;

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CardData {
  cardNumber: string;
  cardHolder: string;
  expMonth: string;
  expYear: string;
  cvc: string;
  installments: number;
}

export interface DeliveryData {
  address: string;
  city: string;
  department: string;
  postalCode: string;
}

export interface Fees {
  baseFeeCents: number;
  deliveryFeeCents: number;
  totalAmountCents: number;
}

// Pasos del flujo:
// 1 → ProductPage  2 → CardForm  3 → DeliveryForm  4 → Summary  5 → Result
export type CheckoutStep = 1 | 2 | 3 | 4 | 5;

interface CheckoutState {
  step: CheckoutStep;
  productId: string | null;
  quantity: number;
  cardData: CardData | null;
  deliveryData: DeliveryData | null;
  transactionId: string | null;
  reference: string | null;
  fees: Fees | null;
}

const initialState: CheckoutState = {
  step: 1,
  productId: null,
  quantity: 1,
  cardData: null,
  deliveryData: null,
  transactionId: null,
  reference: null,
  fees: null,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    selectProduct(
      state,
      action: PayloadAction<{ productId: string; quantity: number }>,
    ) {
      state.productId = action.payload.productId;
      state.quantity = action.payload.quantity;
      state.step = 2;
    },

    saveCardData(state, action: PayloadAction<CardData>) {
      state.cardData = action.payload;
      state.step = 3;
    },

    saveDeliveryData(state, action: PayloadAction<DeliveryData>) {
      state.deliveryData = action.payload;
      state.step = 4;
    },

    setTransactionCreated(
      state,
      action: PayloadAction<{
        transactionId: string;
        reference: string;
        fees: Fees;
      }>,
    ) {
      state.transactionId = action.payload.transactionId;
      state.reference = action.payload.reference;
      state.fees = action.payload.fees;
      state.step = 5;
    },

    goToStep(state, action: PayloadAction<CheckoutStep>) {
      state.step = action.payload;
    },

    resetCheckout() {
      return initialState;
    },
  },
});

export const {
  selectProduct,
  saveCardData,
  saveDeliveryData,
  setTransactionCreated,
  goToStep,
  resetCheckout,
} = checkoutSlice.actions;

export const checkoutReducer = checkoutSlice.reducer;

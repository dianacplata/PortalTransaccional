import { checkoutReducer, selectProduct, saveCardData, saveDeliveryData, setTransactionCreated, goToStep, resetCheckout } from './checkoutSlice';
import type { CardData, DeliveryData } from './checkoutSlice';

const initialState = {
  step: 1 as const,
  productId: null,
  quantity: 1,
  cardData: null,
  deliveryData: null,
  transactionId: null,
  reference: null,
  fees: null,
};

const cardData: CardData = {
  cardNumber: '4242424242424242',
  cardHolder: 'Test User',
  expMonth: '12',
  expYear: '28',
  cvc: '123',
  installments: 1,
};

const deliveryData: DeliveryData = {
  customerName: 'Test User',
  customerEmail: 'test@example.com',
  customerPhone: '3001234567',
  address: 'Calle 1 # 2-3',
  city: 'Bogotá',
  department: 'Cundinamarca',
  postalCode: '110111',
};

describe('checkoutSlice', () => {
  it('returns initial state when called with undefined', () => {
    expect(checkoutReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('selectProduct sets productId, quantity and advances to step 2', () => {
    const state = checkoutReducer(undefined, selectProduct({ productId: 'uuid-1', quantity: 2 }));
    expect(state.productId).toBe('uuid-1');
    expect(state.quantity).toBe(2);
    expect(state.step).toBe(2);
  });

  it('saveCardData stores card data and advances to step 3', () => {
    const state = checkoutReducer(undefined, saveCardData(cardData));
    expect(state.cardData).toEqual(cardData);
    expect(state.step).toBe(3);
  });

  it('saveDeliveryData stores delivery data and advances to step 4', () => {
    const state = checkoutReducer(undefined, saveDeliveryData(deliveryData));
    expect(state.deliveryData).toEqual(deliveryData);
    expect(state.step).toBe(4);
  });

  it('setTransactionCreated stores transactionId, reference, and fees', () => {
    const fees = { baseFeeCents: 300000, deliveryFeeCents: 150000, totalAmountCents: 950000 };
    const state = checkoutReducer(undefined, setTransactionCreated({ transactionId: 'tx-1', reference: 'REF-001', fees }));
    expect(state.transactionId).toBe('tx-1');
    expect(state.reference).toBe('REF-001');
    expect(state.fees).toEqual(fees);
  });

  it('goToStep changes step without touching other state', () => {
    const prev = checkoutReducer(undefined, selectProduct({ productId: 'uuid-1', quantity: 1 }));
    const state = checkoutReducer(prev, goToStep(4 as const));
    expect(state.step).toBe(4);
    expect(state.productId).toBe('uuid-1');
  });

  it('resetCheckout returns to initial state', () => {
    const withData = checkoutReducer(undefined, selectProduct({ productId: 'uuid-1', quantity: 1 }));
    const state = checkoutReducer(withData, resetCheckout());
    expect(state).toEqual(initialState);
  });
});

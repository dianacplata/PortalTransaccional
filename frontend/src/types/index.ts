export interface Product {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  stock: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export type TransactionStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'DECLINED'
  | 'VOIDED'
  | 'ERROR';

export interface Transaction {
  id: string;
  productId: string;
  customerId: string;
  quantity: number;
  productAmountCents: number;
  baseFeeCents: number;
  deliveryFeeCents: number;
  totalAmountCents: number;
  status: TransactionStatus;
  payTransactionId: string | null;
  reference: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionPayload {
  productId: string;
  quantity: number;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  delivery: {
    address: string;
    city: string;
    department: string;
    postalCode: string;
  };
}

export interface ProcessPaymentPayload {
  cardNumber: string;
  cardHolder: string;
  expMonth: string;
  expYear: string;
  cvc: string;
  installments: number;
}

export interface CreateTransactionResponse {
  transactionId: string;
  reference: string;
  totalAmountCents: number;
  baseFeeCents: number;
  deliveryFeeCents: number;
}

export interface ProcessPaymentResponse {
  transactionId: string;
  status: TransactionStatus;
  payTransactionId: string;
  reference: string;
}

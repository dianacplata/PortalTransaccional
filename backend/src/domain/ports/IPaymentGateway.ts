import { TransactionStatus } from '../value-objects/TransactionStatus';
import { CardBrand } from '../value-objects/CardBrand';

export const PAYMENT_GATEWAY = Symbol('PAYMENT_GATEWAY');

export interface CardTokenRequest {
  number: string;
  cvc: string;
  expMonth: string;
  expYear: string;
  cardHolder: string;
}

export interface CardToken {
  id: string;
  brand: CardBrand;
  lastFour: string;
}

export interface PaymentRequest {
  reference: string;
  amountInCents: number;
  currency: string;
  customerEmail: string;
  cardTokenId: string;
  installments: number;
}

export interface PaymentResult {
  wompiTransactionId: string;
  status: TransactionStatus;
  reference: string;
}

export interface IPaymentGateway {
  tokenizeCard(card: CardTokenRequest): Promise<CardToken>;
  createPayment(request: PaymentRequest): Promise<PaymentResult>;
  getTransactionStatus(wompiTransactionId: string): Promise<TransactionStatus>;
}

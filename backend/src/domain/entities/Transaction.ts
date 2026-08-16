import { Money } from '../value-objects/Money';
import { TransactionStatus, isCompleted } from '../value-objects/TransactionStatus';

export interface CreateTransactionParams {
  id: string;
  productId: string;
  customerId: string;
  deliveryId: string;
  quantity: number;
  productAmount: Money;
  baseFee: Money;
  deliveryFee: Money;
  reference: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Transaction {
  private _status: TransactionStatus;
  private _wompiTransactionId: string | null;

  private constructor(
    public readonly id: string,
    public readonly productId: string,
    public readonly customerId: string,
    public readonly deliveryId: string,
    public readonly quantity: number,
    private readonly _productAmount: Money,
    private readonly _baseFee: Money,
    private readonly _deliveryFee: Money,
    public readonly reference: string,
    status: TransactionStatus,
    wompiTransactionId: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {
    this._status = status;
    this._wompiTransactionId = wompiTransactionId;
  }

  /** Factory: solo se puede crear en estado PENDING */
  static createPending(params: CreateTransactionParams): Transaction {
    return new Transaction(
      params.id,
      params.productId,
      params.customerId,
      params.deliveryId,
      params.quantity,
      params.productAmount,
      params.baseFee,
      params.deliveryFee,
      params.reference,
      TransactionStatus.PENDING,
      null,
      params.createdAt,
      params.updatedAt,
    );
  }

  /** Rehidrata desde persistencia */
  static fromPersistence(
    id: string,
    productId: string,
    customerId: string,
    deliveryId: string,
    quantity: number,
    productAmount: Money,
    baseFee: Money,
    deliveryFee: Money,
    reference: string,
    status: TransactionStatus,
    wompiTransactionId: string | null,
    createdAt: Date,
    updatedAt: Date,
  ): Transaction {
    return new Transaction(
      id, productId, customerId, deliveryId, quantity,
      productAmount, baseFee, deliveryFee, reference,
      status, wompiTransactionId, createdAt, updatedAt,
    );
  }

  get status(): TransactionStatus {
    return this._status;
  }

  get wompiTransactionId(): string | null {
    return this._wompiTransactionId;
  }

  get totalAmount(): Money {
    return this._productAmount.add(this._baseFee).add(this._deliveryFee);
  }

  get productAmount(): Money { return this._productAmount; }
  get baseFee(): Money       { return this._baseFee; }
  get deliveryFee(): Money   { return this._deliveryFee; }

  get isCompleted(): boolean {
    return isCompleted(this._status);
  }

  assignWompiId(wompiId: string): void {
    this._wompiTransactionId = wompiId;
  }

  updateStatus(newStatus: TransactionStatus): void {
    if (this.isCompleted)
      throw new Error(`Cannot update a completed transaction (${this._status})`);
    this._status = newStatus;
  }
}

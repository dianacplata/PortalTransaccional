import { Transaction } from './Transaction';
import { Money } from '../value-objects/Money';
import { TransactionStatus } from '../value-objects/TransactionStatus';

const makeParams = () => ({
  id:            'tx-uuid',
  productId:     'product-uuid',
  customerId:    'customer-uuid',
  deliveryId:    'delivery-uuid',
  quantity:      2,
  productAmount: Money.of(20_000),
  baseFee:       Money.of(3_000),
  deliveryFee:   Money.of(1_500),
  reference:     'REF-001',
  createdAt:     new Date('2024-01-01'),
  updatedAt:     new Date('2024-01-01'),
});

describe('Transaction', () => {
  describe('createPending()', () => {
    it('creates a transaction in PENDING status', () => {
      const tx = Transaction.createPending(makeParams());
      expect(tx.status).toBe(TransactionStatus.PENDING);
    });

    it('starts with a null payTransactionId', () => {
      const tx = Transaction.createPending(makeParams());
      expect(tx.payTransactionId).toBeNull();
    });
  });

  describe('totalAmount', () => {
    it('is the sum of productAmount + baseFee + deliveryFee', () => {
      const tx = Transaction.createPending(makeParams());
      expect(tx.totalAmount.cents).toBe(24_500); // 20_000 + 3_000 + 1_500
    });
  });

  describe('updateStatus()', () => {
    it('changes the status when transaction is not completed', () => {
      const tx = Transaction.createPending(makeParams());
      tx.updateStatus(TransactionStatus.APPROVED);
      expect(tx.status).toBe(TransactionStatus.APPROVED);
    });

    it('throws when trying to update a completed transaction', () => {
      const tx = Transaction.createPending(makeParams());
      tx.updateStatus(TransactionStatus.APPROVED);
      expect(() => tx.updateStatus(TransactionStatus.DECLINED)).toThrow();
    });
  });

  describe('assignPayId()', () => {
    it('sets the payTransactionId', () => {
      const tx = Transaction.createPending(makeParams());
      tx.assignPayId('pay-abc-123');
      expect(tx.payTransactionId).toBe('pay-abc-123');
    });
  });

  describe('isCompleted', () => {
    it('returns false for PENDING', () => {
      expect(Transaction.createPending(makeParams()).isCompleted).toBe(false);
    });

    it('returns true for APPROVED', () => {
      const tx = Transaction.createPending(makeParams());
      tx.updateStatus(TransactionStatus.APPROVED);
      expect(tx.isCompleted).toBe(true);
    });
  });
});

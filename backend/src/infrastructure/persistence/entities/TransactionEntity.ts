import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { TransactionStatus } from '../../../domain/value-objects/TransactionStatus';

@Entity('transactions')
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @Column({ name: 'customer_id', type: 'uuid' })
  customerId: string;

  @Column({ name: 'delivery_id', type: 'uuid' })
  deliveryId: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ name: 'product_amount_cents', type: 'int' })
  productAmountCents: number;

  @Column({ name: 'base_fee_cents', type: 'int' })
  baseFeeCents: number;

  @Column({ name: 'delivery_fee_cents', type: 'int' })
  deliveryFeeCents: number;

  @Column({ length: 200 })
  reference: string;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  // Fix 2: explicit varchar nullable to avoid DataTypeNotSupportedError
  @Column({ name: 'wompi_transaction_id', type: 'varchar', nullable: true })
  wompiTransactionId: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
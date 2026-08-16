import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('deliveries')
export class DeliveryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'transaction_id', type: 'uuid', unique: true })
  transactionId: string;

  @Column({ length: 300 })
  address: string;

  @Column({ length: 100 })
  city: string;

  @Column({ length: 100 })
  department: string;

  @Column({ name: 'postal_code', length: 20 })
  postalCode: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
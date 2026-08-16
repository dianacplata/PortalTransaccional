import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITransactionRepository } from '../../../domain/ports/ITransactionRepository';
import { Transaction } from '../../../domain/entities/Transaction';
import { Money } from '../../../domain/value-objects/Money';
import { TransactionEntity } from '../entities/TransactionEntity';

@Injectable()
export class PostgresTransactionRepository implements ITransactionRepository {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly repo: Repository<TransactionEntity>,
  ) {}

  async findById(id: string): Promise<Transaction | null> {
    const row = await this.repo.findOne({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async save(transaction: Transaction): Promise<Transaction> {
    const saved = await this.repo.save(this.toEntity(transaction));
    return this.toDomain(saved);
  }

  async update(transaction: Transaction): Promise<Transaction> {
    const saved = await this.repo.save(this.toEntity(transaction));
    return this.toDomain(saved);
  }

  private toDomain(row: TransactionEntity): Transaction {
    return Transaction.fromPersistence(
      row.id,
      row.productId,
      row.customerId,
      row.deliveryId,
      row.quantity,
      Money.of(row.productAmountCents),
      Money.of(row.baseFeeCents),
      Money.of(row.deliveryFeeCents),
      row.reference,
      row.status,
      row.wompiTransactionId,
      row.createdAt,
      row.updatedAt,
    );
  }

  private toEntity(tx: Transaction): TransactionEntity {
    const e = new TransactionEntity();
    e.id = tx.id;
    e.productId = tx.productId;
    e.customerId = tx.customerId;
    e.deliveryId = tx.deliveryId;
    e.quantity = tx.quantity;
    e.productAmountCents = tx.productAmount.cents;
    e.baseFeeCents = tx.baseFee.cents;
    e.deliveryFeeCents = tx.deliveryFee.cents;
    e.reference = tx.reference;
    e.status = tx.status;
    e.wompiTransactionId = tx.wompiTransactionId;
    e.createdAt = tx.createdAt;
    e.updatedAt = tx.updatedAt;
    return e;
  }
}
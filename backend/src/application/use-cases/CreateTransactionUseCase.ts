import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { IProductRepository, PRODUCT_REPOSITORY } from '../../domain/ports/IProductRepository';
import { ITransactionRepository, TRANSACTION_REPOSITORY } from '../../domain/ports/ITransactionRepository';
import { ICustomerRepository, CUSTOMER_REPOSITORY } from '../../domain/ports/ICustomerRepository';
import { Transaction } from '../../domain/entities/Transaction';
import { Customer } from '../../domain/entities/Customer';
import { Money } from '../../domain/value-objects/Money';
import { ProductNotFoundException } from '../../domain/exceptions/ProductNotFoundException';
import { InsufficientStockException } from '../../domain/exceptions/InsufficientStockException';
import { Result, ok, err } from '../result/Result';
import { CreateTransactionDto } from '../dto/CreateTransactionDto';

export interface CreateTransactionResult {
  transactionId: string;
  reference: string;
  totalAmountCents: number;
  baseFeeCents: number;
  deliveryFeeCents: number;
}

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepo: ITransactionRepository,
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepo: ICustomerRepository,
    @Inject('BASE_FEE_CENTS')
    private readonly baseFeeCents: number,
    @Inject('DELIVERY_FEE_CENTS')
    private readonly deliveryFeeCents: number,
  ) {}

  async execute(dto: CreateTransactionDto): Promise<Result<CreateTransactionResult>> {
    const product = await this.productRepo.findById(dto.productId);
    if (!product) return err(new ProductNotFoundException(dto.productId));

    if (product.stock < dto.quantity)
      return err(new InsufficientStockException(product.stock, dto.quantity));

    let customer = await this.customerRepo.findByEmail(dto.customer.email);
    if (!customer) {
      customer = await this.customerRepo.save(
        new Customer(uuidv4(), dto.customer.name, dto.customer.email, dto.customer.phone, new Date()),
      );
    }

    const productAmount = product.totalPrice(dto.quantity);
    const baseFee = Money.of(this.baseFeeCents);
    const deliveryFee = Money.of(this.deliveryFeeCents);
    const now = new Date();
    const reference = REF-+${Date.now()}-;

    const transaction = Transaction.createPending({
      id: uuidv4(),
      productId: dto.productId,
      customerId: customer.id,
      deliveryId: uuidv4(),
      quantity: dto.quantity,
      productAmount,
      baseFee,
      deliveryFee,
      reference,
      createdAt: now,
      updatedAt: now,
    });

    const saved = await this.transactionRepo.save(transaction);

    return ok({
      transactionId: saved.id,
      reference: saved.reference,
      totalAmountCents: saved.totalAmount.cents,
      baseFeeCents: baseFee.cents,
      deliveryFeeCents: deliveryFee.cents,
    });
  }
}
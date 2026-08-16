import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICustomerRepository } from '../../../domain/ports/ICustomerRepository';
import { Customer } from '../../../domain/entities/Customer';
import { CustomerEntity } from '../entities/CustomerEntity';

@Injectable()
export class PostgresCustomerRepository implements ICustomerRepository {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly repo: Repository<CustomerEntity>,
  ) {}

  async findByEmail(email: string): Promise<Customer | null> {
    const row = await this.repo.findOne({ where: { email } });
    return row ? this.toDomain(row) : null;
  }

  async save(customer: Customer): Promise<Customer> {
    const saved = await this.repo.save(this.toEntity(customer));
    return this.toDomain(saved);
  }

  private toDomain(row: CustomerEntity): Customer {
    return new Customer(row.id, row.name, row.email, row.phone, row.createdAt);
  }

  private toEntity(customer: Customer): CustomerEntity {
    const e = new CustomerEntity();
    e.id = customer.id;
    e.name = customer.name;
    e.email = customer.email;
    e.phone = customer.phone;
    e.createdAt = customer.createdAt;
    return e;
  }
}
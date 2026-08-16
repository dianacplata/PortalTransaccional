import { Customer } from '../entities/Customer';

export const CUSTOMER_REPOSITORY = Symbol('CUSTOMER_REPOSITORY');

export interface ICustomerRepository {
  findByEmail(email: string): Promise<Customer | null>;
  save(customer: Customer): Promise<Customer>;
}

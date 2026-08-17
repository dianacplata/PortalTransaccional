export class Money {
  private constructor(private readonly _cents: number) {}

  static of(cents: number): Money {
    if (!Number.isInteger(cents) || cents < 0)
      throw new Error(`Invalid money amount: ${cents}`);
    return new Money(cents);
  }

  add(other: Money): Money {
    return Money.of(this._cents + other._cents);
  }

  multiply(n: number): Money {
    if (!Number.isInteger(n) || n < 0)
      throw new Error(`Invalid multiplier: ${n}`);
    return Money.of(this._cents * n);
  }

  equals(other: Money): boolean {
    return this._cents === other._cents;
  }

  /** Formatea en pesos colombianos: "$89.000" */
  format(): string {
    return `$${(this._cents / 100).toLocaleString('es-CO')}`;
  }

  get cents(): number {
    return this._cents;
  }
}

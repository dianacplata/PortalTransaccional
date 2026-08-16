import { IsString, IsNotEmpty, IsInt, IsPositive, Min, Max, Matches } from 'class-validator';

export class ProcessPaymentDto {
  @IsString()
  @IsNotEmpty()
  cardNumber: string;

  @IsString()
  @IsNotEmpty()
  cardHolder: string;

  /** MM — dos dígitos */
  @Matches(/^(0[1-9]|1[0-2])$/)
  expMonth: string;

  /** YY — dos dígitos */
  @Matches(/^\d{2}$/)
  expYear: string;

  @IsString()
  @IsNotEmpty()
  cvc: string;

  @IsInt()
  @Min(1)
  @Max(36)
  installments: number;
}

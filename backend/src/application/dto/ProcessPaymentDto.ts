import { IsString, IsNotEmpty, IsInt, IsPositive, Min, Max, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProcessPaymentDto {
  @ApiProperty({ example: '4242424242424242' })
  @IsString()
  @IsNotEmpty()
  cardNumber: string;

  @ApiProperty({ example: 'MARÍA GARCÍA' })
  @IsString()
  @IsNotEmpty()
  cardHolder: string;

  /** MM — dos dígitos */
  @ApiProperty({ example: '12', pattern: '^(0[1-9]|1[0-2])$' })
  @Matches(/^(0[1-9]|1[0-2])$/)
  expMonth: string;

  /** YY — dos dígitos */
  @ApiProperty({ example: '28', pattern: '^\\d{2}$' })
  @Matches(/^\d{2}$/)
  expYear: string;

  @ApiProperty({ example: '123' })
  @IsString()
  @IsNotEmpty()
  cvc: string;

  @ApiProperty({ example: 1, minimum: 1, maximum: 36 })
  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(36)
  installments: number;
}

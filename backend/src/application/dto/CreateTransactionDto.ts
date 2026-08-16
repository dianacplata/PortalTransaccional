import { IsUUID, IsInt, IsPositive, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CustomerDataDto } from './CustomerDataDto';
import { DeliveryDataDto } from './DeliveryDataDto';

export class CreateTransactionDto {
  @IsUUID()
  productId: string;

  @IsInt()
  @IsPositive()
  quantity: number;

  /**
   * @ValidateNested + @Type() necesarios para que ValidationPipe con
   * whitelist:true reconozca los campos anidados (ver DESARROLLO.md Fix 3).
   */
  @ValidateNested()
  @Type(() => CustomerDataDto)
  customer: CustomerDataDto;

  @ValidateNested()
  @Type(() => DeliveryDataDto)
  delivery: DeliveryDataDto;
}

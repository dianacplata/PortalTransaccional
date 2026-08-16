import { IsUUID, IsInt, IsPositive, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CustomerDataDto } from './CustomerDataDto';
import { DeliveryDataDto } from './DeliveryDataDto';

export class CreateTransactionDto {
  @ApiProperty({ format: 'uuid', example: 'b3e1c2d4-...' })
  @IsUUID()
  productId: string;

  @ApiProperty({ example: 1, minimum: 1 })
  @IsInt()
  @IsPositive()
  quantity: number;

  /**
   * @ValidateNested + @Type() necesarios para que ValidationPipe con
   * whitelist:true reconozca los campos anidados (ver DESARROLLO.md Fix 3).
   */
  @ApiProperty({ type: () => CustomerDataDto })
  @ValidateNested()
  @Type(() => CustomerDataDto)
  customer: CustomerDataDto;

  @ApiProperty({ type: () => DeliveryDataDto })
  @ValidateNested()
  @Type(() => DeliveryDataDto)
  delivery: DeliveryDataDto;
}

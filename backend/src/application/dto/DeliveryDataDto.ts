import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeliveryDataDto {
  @ApiProperty({ example: 'Calle 100 # 20-30 Apto 401', minLength: 5, maxLength: 300 })
  @IsString()
  @IsNotEmpty()
  @Length(5, 300)
  address: string;

  @ApiProperty({ example: 'Bogotá', minLength: 2, maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  city: string;

  @ApiProperty({ example: 'Cundinamarca', minLength: 2, maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  department: string;

  @ApiProperty({ example: '110111', minLength: 4, maxLength: 10 })
  @IsString()
  @IsNotEmpty()
  @Length(4, 10)
  postalCode: string;
}

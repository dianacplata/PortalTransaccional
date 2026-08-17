import { IsEmail, IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CustomerDataDto {
  @ApiProperty({ example: 'María García', minLength: 2, maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @Length(2, 200)
  name: string;

  @ApiProperty({ example: 'maria@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '3001234567', minLength: 7, maxLength: 20 })
  @IsString()
  @IsNotEmpty()
  @Length(7, 20)
  phone: string;
}

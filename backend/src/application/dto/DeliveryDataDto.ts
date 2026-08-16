import { IsString, IsNotEmpty, Length } from 'class-validator';

export class DeliveryDataDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 300)
  address: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  city: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  department: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 10)
  postalCode: string;
}

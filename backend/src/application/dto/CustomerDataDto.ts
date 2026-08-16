import { IsEmail, IsString, IsNotEmpty, Length } from 'class-validator';

export class CustomerDataDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 200)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(7, 20)
  phone: string;
}

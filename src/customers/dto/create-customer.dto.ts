import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateCustomerDto {

  @IsString()
  @IsOptional()
  _id?: string;

  @IsString()
  @IsNotEmpty()
  codCus: string;

  @IsString()
  @IsNotEmpty()
  nameCus: string;

  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => value === "" ? undefined : value)
  emailCus?: string;

  @IsOptional()
  @IsString()
  domcomer?: string;

  @IsOptional()
  @IsString()
  cuit?: string;

  @IsOptional()
  @IsString()
  coniva?: string;
}

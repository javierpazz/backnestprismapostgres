import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateProveedoreDto {

  @IsString()
  @IsOptional()
  _id?: string;

  @IsString()
  @IsNotEmpty()
  codSup: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => value === "" ? undefined : value)
  email?: string;

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


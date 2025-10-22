import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateParteDto {

  @IsString()
  @IsOptional()
  _id?: string;

  @IsString()
  codPar: string;

  @IsString()
  name: string;

  @IsOptional()
  // @IsEmail()
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

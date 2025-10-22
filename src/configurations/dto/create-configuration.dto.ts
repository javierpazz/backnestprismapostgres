import { IsString, IsNumber, IsDateString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateConfigurationDto {


  @IsString()
  @IsOptional()
  _id?: string;

  @IsString()
  codCon: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  domcomer?: string;

  @IsOptional()
  @IsString()
  cuit?: string;

  @IsOptional()
  @IsString()
  coniva?: string;

  @IsOptional()
  @IsString()
  ib?: string;
  
  @IsString()
  feciniact: string;

  @IsNumber()
  @IsOptional()
  numIntCaj?: number;

  @IsNumber()
  @IsOptional()
  numIntMov?: number;

  @IsNumber()
  @IsOptional()
  numIntOdp?: number;

  @IsNumber()
  @IsOptional()
  numIntRec?: number;

  @IsNumber()
  @IsOptional()
  numIntRem?: number;

  @IsNumber()
  @IsOptional()
  numIntCli?: number;
  
}

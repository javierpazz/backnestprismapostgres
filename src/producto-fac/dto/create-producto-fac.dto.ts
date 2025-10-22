
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, IsEnum, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { Supplier } from '@prisma/client';

export enum ProductType {
  SHIRTS = 'shirts',
  PANTS = 'pants',
  HOODIES = 'hoodies',
  HATS = 'hats',
}

export enum Gender {
  MEN = 'men',
  WOMEN = 'women',
  KID = 'kid',
  UNISEX = 'unisex',
}

class ReviewDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsNumber()
  rating?: number;
}

export class CreateProductoFacDto {

  
  @IsString()
  @IsOptional()
  _id?: string;

  @IsString()
  @IsNotEmpty()
  codPro: string;

  @IsString()
  @IsNotEmpty()
  codigoPro: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  medPro: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsString()
  image1?: string;

  @IsOptional()
  @IsString()
  image2?: string;

  @IsOptional()
  @IsString()
  image3?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsString()
  id_config: string; // FK a Configuration

  @IsOptional()
  @IsString()
  id_category?: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number) 
  price?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number) 
  priceBuy?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number) 
  inStock?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number) 
  minStock?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number) 
  porIva?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number) 
  rating?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number) 
  numReviews?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsEnum(ProductType)
  type?: ProductType;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sizes?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReviewDto)
  reviews?: ReviewDto[];

  @IsString()
  @IsOptional()
  createdAt?: string;

  @IsString()
  @IsOptional()
  updatedAt?: string;

  // // 🔗 Relación con Configuration (UUID)
  // @IsOptional()
  // @IsUUID()
  // codSup?: string;  

  // 🔗 Relación con Configuration (UUID)
  @IsOptional()
  @IsUUID()
  supplier?: string;  


}

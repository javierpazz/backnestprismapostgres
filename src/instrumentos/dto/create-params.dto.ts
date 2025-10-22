
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  IsMongoId,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  medPro: string;

  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsString()
  image?: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  size?: string;

  @IsNumber()
  porIva: number;

  @IsOptional()
  @IsString()
  venDat?: string;

  @IsOptional()
  @IsString()
  observ?: string;

  @IsOptional()
  @IsBoolean()
  terminado?: boolean;

  @IsMongoId()
  _id: string;
}

export class CreateParamsDto {

  @IsString()
  @IsOptional()
  _id?: string;

  @IsString()
  @IsNotEmpty()
  codIns?: string;

  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];
}

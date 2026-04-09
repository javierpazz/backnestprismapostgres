
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';



export class CreateInstrumentoDto {

  @IsString()
  @IsOptional()
  _id?: string;


  @IsString()
  @IsOptional()
  instrumentoId?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true) // convierte "true"/true → true, "false"/false → false
  ecoActive?: boolean;


  @IsString()
  @IsNotEmpty()
  codIns: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  detalle: string;

  @IsOptional()
  @IsBoolean()
  publico?: boolean;


}

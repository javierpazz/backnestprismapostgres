
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';



export class CreateInstrumentoDto {

  @IsString()
  @IsOptional()
  _id?: string;

  @IsString()
  @IsNotEmpty()
  codIns: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsBoolean()
  publico?: boolean;

}

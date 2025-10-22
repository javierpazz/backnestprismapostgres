
import {
  IsString,
  IsNotEmpty,
  IsOptional,
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

}

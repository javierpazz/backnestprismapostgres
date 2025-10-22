
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateEstadosordenDto {

  @IsString()
  @IsOptional()
  _id?: string;

  @IsString()
  name: string;

  @IsString()
  note: string;

}


import { Transform } from 'class-transformer';
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateEncargadoDto {

  @IsString()
  @IsOptional()
  _id?: string;

  @IsString()
  codEnc: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => value === "" ? undefined : value)
  email?: string;
}

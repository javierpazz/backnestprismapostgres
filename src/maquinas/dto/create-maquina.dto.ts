
import { Type } from 'class-transformer';
import { IsString, IsEmail, IsOptional, IsBoolean, IsInt, IsUUID } from 'class-validator';

export class CreateMaquinaDto {

  @IsString()
  @IsOptional()
  _id?: string;

  @IsString()
  codMaq: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  serNum?: string;

  // 🔗 Relación con customer (UUID)
  @IsOptional()
  @IsUUID()
  codCus?: string;



}


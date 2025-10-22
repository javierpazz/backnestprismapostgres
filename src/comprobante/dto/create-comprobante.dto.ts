import { Type } from 'class-transformer';
import { IsString, IsEmail, IsOptional, IsBoolean, IsInt, IsUUID } from 'class-validator';

export class CreateComprobanteDto {

  @IsString()
  @IsOptional()
  _id?: string;

  @IsString()
  codCom: string;

  @IsString()
  nameCom: string;

  @IsString()
  @IsOptional()
  claCom?: string;

  @IsOptional()
  @IsBoolean()
  isHaber?: boolean;

  @IsOptional()
  @IsBoolean()
  noDisc?: boolean;

  @IsOptional()
  @IsBoolean()
  toDisc?: boolean;

  @IsOptional()
  @IsBoolean()
  itDisc?: boolean;

  @IsOptional()
  @IsBoolean()
  interno?: boolean;

  @IsOptional()
  @Type(() => Number)   // 👈 convierte el valor recibido a número
  @IsInt()
  numInt?: number;

  // 🔗 Relación con Configuration (UUID)
  @IsOptional()
  @IsUUID()
  codCon?: string;



}

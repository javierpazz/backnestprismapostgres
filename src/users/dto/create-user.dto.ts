import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateUserDto {

  @IsString()
  @IsOptional()
  _id?: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsNotEmpty()
  name: string;


  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  passwordNue?: string;

  @IsBoolean()
  @IsOptional()
  puede?: boolean;

  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true) // convierte "true"/true → true, "false"/false → false
  isActive?: boolean;

  @IsEnum(['admin', 'user', 'super-user', 'SEO', 'client'])
  role: string;

}

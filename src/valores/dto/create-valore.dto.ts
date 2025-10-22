
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateValoreDto {

  @IsString()
  @IsOptional()
  _id?: string;

  @IsString()
  codVal: string;

  @IsString()
  desVal: string;

}

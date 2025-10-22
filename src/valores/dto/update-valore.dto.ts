import { PartialType } from '@nestjs/mapped-types';
import { CreateValoreDto } from './create-valore.dto';

export class UpdateValoreDto extends PartialType(CreateValoreDto) {}

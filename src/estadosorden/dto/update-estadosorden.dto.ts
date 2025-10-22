import { PartialType } from '@nestjs/mapped-types';
import { CreateEstadosordenDto } from './create-estadosorden.dto';

export class UpdateEstadosordenDto extends PartialType(CreateEstadosordenDto) {}

import { PartialType } from '@nestjs/mapped-types';
import { CreateProductoFacDto } from './create-producto-fac.dto';

export class UpdateProductoFacDto extends PartialType(CreateProductoFacDto) {}

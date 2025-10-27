import { Module } from '@nestjs/common';
import { ProductoFacService } from './producto-fac.service';
import { ProductoFacController } from './producto-fac.controller';

@Module({
  controllers: [ProductoFacController],
  providers: [ProductoFacService],
  exports: [ProductoFacService], 
})
export class ProductoFacModule {}

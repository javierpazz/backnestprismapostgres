import { Module } from '@nestjs/common';
import { ProductoFacService } from './producto-fac.service';
import { ProductoFacController } from './producto-fac.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ProductoFacController],
  providers: [ProductoFacService],
  exports: [ProductoFacService], 
  imports: [AuthModule],

})
export class ProductoFacModule {}

import { Module } from '@nestjs/common';
import { ProveedoresService } from './proveedores.service';
import { ProveedoresController } from './proveedores.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ProveedoresController],
  providers: [ProveedoresService],
  imports: [AuthModule],

})
export class ProveedoresModule {}

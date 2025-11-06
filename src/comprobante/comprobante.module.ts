import { Module } from '@nestjs/common';
import { ComprobanteService } from './comprobante.service';
import { ComprobanteController } from './comprobante.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ComprobanteController],
  providers: [ComprobanteService],
  imports: [AuthModule],
})
export class ComprobanteModule {}

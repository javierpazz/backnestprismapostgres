import { Module } from '@nestjs/common';
import { EncargadosService } from './encargados.service';
import { EncargadosController } from './encargados.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [EncargadosController],
  providers: [EncargadosService],
  imports: [AuthModule],
})
export class EncargadosModule {}

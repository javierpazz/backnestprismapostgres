import { Module } from '@nestjs/common';
import { MaquinasService } from './maquinas.service';
import { MaquinasController } from './maquinas.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [MaquinasController],
  providers: [MaquinasService],
  imports: [AuthModule],
  
})
export class MaquinasModule {}

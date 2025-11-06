import { Module } from '@nestjs/common';
import { EstadosordenService } from './estadosorden.service';
import { EstadosordenController } from './estadosorden.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [EstadosordenController],
  providers: [EstadosordenService],
  imports: [AuthModule],
})
export class EstadosordenModule {}

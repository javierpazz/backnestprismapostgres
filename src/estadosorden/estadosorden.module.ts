import { Module } from '@nestjs/common';
import { EstadosordenService } from './estadosorden.service';
import { EstadosordenController } from './estadosorden.controller';

@Module({
  controllers: [EstadosordenController],
  providers: [EstadosordenService],
})
export class EstadosordenModule {}

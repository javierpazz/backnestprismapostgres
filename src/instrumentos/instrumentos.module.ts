import { Module } from '@nestjs/common';
import { InstrumentosService } from './instrumentos.service';
import { InstrumentosController } from './instrumentos.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [InstrumentosController],
  providers: [InstrumentosService],
  imports: [ConfigModule]
})
export class InstrumentosModule {}

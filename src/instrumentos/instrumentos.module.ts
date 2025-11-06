import { Module } from '@nestjs/common';
import { InstrumentosService } from './instrumentos.service';
import { InstrumentosController } from './instrumentos.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [InstrumentosController],
  providers: [InstrumentosService],
  imports: [ConfigModule, AuthModule]
})
export class InstrumentosModule {}

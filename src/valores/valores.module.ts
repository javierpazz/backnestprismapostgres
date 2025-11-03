import { Module } from '@nestjs/common';
import { ValoresService } from './valores.service';
import { ValoresController } from './valores.controller';

@Module({
  controllers: [ValoresController],
  providers: [ValoresService],
  exports: [ValoresService],
})
export class ValoresModule {}

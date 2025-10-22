import { Module } from '@nestjs/common';
import { PartesService } from './partes.service';
import { PartesController } from './partes.controller';

@Module({
  controllers: [PartesController],
  providers: [PartesService],
 
  
})
export class PartesModule {}

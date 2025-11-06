import { Module } from '@nestjs/common';
import { PartesService } from './partes.service';
import { PartesController } from './partes.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [PartesController],
  providers: [PartesService],
  imports: [AuthModule],
 
  
})
export class PartesModule {}

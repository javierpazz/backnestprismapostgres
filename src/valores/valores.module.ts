import { Module } from '@nestjs/common';
import { ValoresService } from './valores.service';
import { ValoresController } from './valores.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ValoresController],
  providers: [ValoresService],
  imports: [AuthModule],
  exports: [ValoresService],
})
export class ValoresModule {}

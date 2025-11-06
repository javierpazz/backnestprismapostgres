import { forwardRef, Module } from '@nestjs/common';
import { ConfigurationsService } from './configurations.service';
import { ConfigurationsController } from './configurations.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ConfigurationsController],
  providers: [ConfigurationsService],
  exports: [ConfigurationsService], 
  imports: [AuthModule],
  
})
export class ConfigurationsModule {}

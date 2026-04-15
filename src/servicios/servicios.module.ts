import { Module } from '@nestjs/common';
import { ServiciosService } from './servicios.service';
import { ServiciosController } from './servicios.controller';
import { ConfigurationsModule } from 'src/configurations/configurations.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ServiciosController],
  providers: [ServiciosService],
  imports: [ConfigurationsModule, AuthModule],

})
export class ServiciosModule {}

import { Module } from '@nestjs/common';
import { EntradasService } from './entradas.service';
import { EntradasController } from './entradas.controller';
import { ConfigurationsModule } from 'src/configurations/configurations.module';

@Module({
  controllers: [EntradasController],
  providers: [EntradasService],
  imports: [ConfigurationsModule],
})
export class EntradasModule {}

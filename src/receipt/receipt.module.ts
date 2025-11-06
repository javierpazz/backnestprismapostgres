import { Module } from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { ReceiptController } from './receipt.controller';
import { ConfigurationsModule } from 'src/configurations/configurations.module';
import { AuthModule } from 'src/auth/auth.module';
// seria valuee import { ProductoFacModule } from 'src/producto-fac/producto-fac.module';

@Module({
  controllers: [ReceiptController],
  providers: [ReceiptService],
  imports: [ConfigurationsModule, AuthModule],

})
export class ReceiptModule {}




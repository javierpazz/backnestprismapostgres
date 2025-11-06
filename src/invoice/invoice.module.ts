import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { ConfigurationsModule } from 'src/configurations/configurations.module';
import { ProductoFacModule } from 'src/producto-fac/producto-fac.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [InvoiceController],
  providers: [InvoiceService],
  imports: [ConfigurationsModule, ProductoFacModule, AuthModule],
})
export class InvoiceModule {}

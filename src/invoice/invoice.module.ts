import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { ConfigurationsModule } from 'src/configurations/configurations.module';

@Module({
  controllers: [InvoiceController],
  providers: [InvoiceService],
  imports: [ConfigurationsModule],
})
export class InvoiceModule {}

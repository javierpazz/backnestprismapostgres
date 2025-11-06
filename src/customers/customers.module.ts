import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [CustomersController],
  providers: [CustomersService],
  imports: [AuthModule],
  
})
export class CustomersModule {}

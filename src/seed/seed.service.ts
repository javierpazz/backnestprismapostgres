import { BadRequestException, Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';
import { ValoresService } from '../valores/valores.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SeedService extends PrismaClient implements OnModuleInit {
  constructor(private readonly productsService: ProductsService,
        private readonly usersService: UsersService,
        private readonly valoresService: ValoresService) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    console.log('✅ Database connected');
  }
  
  async runSeed() {
    
    ////////
    
    // try {
    //     await this.user.deleteMany({
    //     where: {}, // elimina todos
    //   });
    // } catch (error) {
    //   this.handleExceptions(error);
    // }
    
    ////////
    ////////
    const users = initialData.users;
    
    const insertPromises = [];
    
    users.forEach( use => {
      insertPromises.push( this.usersService.create( use ) );
    });
    
    await Promise.all( insertPromises );
    console.log('🌱 Running seed...');
    return `Seed completed`;
    ////////
    // ////////
    
    // try {
    //     await this.valuee.deleteMany({
    //     where: {}, // elimina todos
    //   });
    // } catch (error) {
    //   this.handleExceptions(error);
    // }
    
    // ////////
    // ////////
    // const valuees = initialData.valuee;
    
    // const insertPromises = [];
    
    // valuees.forEach( valu => {
    //   insertPromises.push( this.valoresService.create( valu ) );
    // });
    
    // await Promise.all( insertPromises );
    // console.log('🌱 Running seed...');
    // return `Seed completed`;
    // ////////
  }
  
  private handleExceptions( error: any ) {
     console.log(error);
    throw new InternalServerErrorException(`Error en Seed`);
  }



}

import { BadRequestException, Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ProductsService } from './../products/products.service';
// import { initialData } from './data/seed-data';
import { initialDataService } from './data/seed-dataService';
import { initialDataVinos } from './data/seed-dataVinos';
import { initialDataEscri } from './data/seed-dataEscri';
import { countries } from './data/seed-countries';
import { ValoresService } from '../valores/valores.service';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService,
        private readonly usersService: UsersService,
        private readonly valoresService: ValoresService,
        private prisma: PrismaService
      ) { }

  
  async runSeedEscri() {
    
          
    try {
/////borrado
  await this.prisma.serviceItem.deleteMany();
  await this.prisma.service.deleteMany();
  await this.prisma.orderAddress.deleteMany();
  await this.prisma.orderItem.deleteMany();
  await this.prisma.order.deleteMany();
  await this.prisma.receiptItem.deleteMany();
  await this.prisma.receipt.deleteMany();
  await this.prisma.paramItem.deleteMany();


  await this.prisma.userAddress.deleteMany();
  await this.prisma.user.deleteMany();
  await this.prisma.country.deleteMany();
  
  await this.prisma.productImage.deleteMany();
  await this.prisma.product.deleteMany();
  await this.prisma.category.deleteMany();
  
  await this.prisma.stateOrd.deleteMany();
  await this.prisma.parte.deleteMany();
  await this.prisma.valuee.deleteMany();
  await this.prisma.instrumento.deleteMany();
  await this.prisma.maquina.deleteMany();
  await this.prisma.customer.deleteMany();
  await this.prisma.encargado.deleteMany();
  await this.prisma.supplier.deleteMany();
  await this.prisma.comprobante.deleteMany();
  await this.prisma.configuration.deleteMany();

/////borrado
        console.log('🌱 Running seed...');  


        const { categories, products, users, configurations, estados, partes, valuees, instrumentos, customers, encargados, maquinas, suppliers, } = initialDataEscri;

        // const users = initialData.users;
        

        // const insertPromises = [];
        // users.forEach( use => {
        //   insertPromises.push( this.usersService.createMany( use ) );
        // });

        // await Promise.all( insertPromises );

          await this.prisma.configuration.create({
            data: configurations[0]
          });
          await this.prisma.configuration.create({
            data: configurations[1]
          });
            // const createdConfiguration = await this.prisma.configuration.findMany();
            const createdConfiguration = await this.prisma.configuration.findMany({
              orderBy: {
                codCon: 'asc', // 👈 ordena 0001, 0002, 0003...
              },
            });
            const CONFIG1 = createdConfiguration[0].id;
            const CONFIG2 = createdConfiguration[1].id;

            await this.prisma.comprobante.createMany({
              data: initialDataEscri.comprobantes.map((c, index) => ({
                ...c,
                codConId: index < 6 ? CONFIG1 : CONFIG2
                // codConId: CONFIG1 
              }))
            });    
            
          await this.prisma.instrumento.createMany({
            data: instrumentos
          });
          await this.prisma.supplier.createMany({
            data: suppliers
          });
          await this.prisma.encargado.createMany({
            data: encargados
          });
          await this.prisma.maquina.createMany({
            data: maquinas
          });
          await this.prisma.customer.createMany({
            data: customers
          });
          await this.prisma.valuee.createMany({
            data: valuees
          });
          await this.prisma.stateOrd.createMany({
            data: estados
          });
          await this.prisma.parte.createMany({
            data: partes
          });

          await this.prisma.user.createMany({
            data: users
          });

          await this.prisma.country.createMany({
            data: countries
          });



          //  Categorias
          // {
          //   name: 'Shirt'
          // }
          const categoriesData = categories.map( (name) => ({ name }));
          
          await this.prisma.category.createMany({
            data: categoriesData
          });

          
          const categoriesDB = await this.prisma.category.findMany();
          
          const categoriesMap = categoriesDB.reduce( (map, category) => {
            map[ category.name.toLowerCase()] = category.id;
            return map;
          }, {} as Record<string, string>); //<string=shirt, string=categoryID>
          
          

          // Productos

          products.forEach( async(product) => {

            const { type, images, ...rest } = product;

            const dbProduct = await this.prisma.product.create({
              data: {
                ...rest,
                categoryId: categoriesMap[type],
                id_config: CONFIG1 
              }
            })


            // Images
            const imagesData = images.map( image => ({
              url: image,
              productId: dbProduct.id
            }));

            await this.prisma.productImage.createMany({
              data: imagesData
            });

          });

        return `Seed completed`;

      } catch (error) {
          this.handleExceptions(error);
        }

  }
  async runSeedServices() {
    
          
    try {
/////borrado
  await this.prisma.serviceItem.deleteMany();
  await this.prisma.service.deleteMany();
  await this.prisma.orderAddress.deleteMany();
  await this.prisma.orderItem.deleteMany();
  await this.prisma.order.deleteMany();
  await this.prisma.receiptItem.deleteMany();
  await this.prisma.receipt.deleteMany();
  await this.prisma.paramItem.deleteMany();


  await this.prisma.userAddress.deleteMany();
  await this.prisma.user.deleteMany();
  await this.prisma.country.deleteMany();
  
  await this.prisma.productImage.deleteMany();
  await this.prisma.product.deleteMany();
  await this.prisma.category.deleteMany();
  
  await this.prisma.stateOrd.deleteMany();
  await this.prisma.parte.deleteMany();
  await this.prisma.valuee.deleteMany();
  await this.prisma.instrumento.deleteMany();
  await this.prisma.maquina.deleteMany();
  await this.prisma.customer.deleteMany();
  await this.prisma.encargado.deleteMany();
  await this.prisma.supplier.deleteMany();
  await this.prisma.comprobante.deleteMany();
  await this.prisma.configuration.deleteMany();

/////borrado
        console.log('🌱 Running seed...');  


        const { categories, products, users, configurations, estados, partes, valuees, instrumentos, customers, encargados, maquinas, suppliers, } = initialDataService;

        // const users = initialData.users;
        

        // const insertPromises = [];
        // users.forEach( use => {
        //   insertPromises.push( this.usersService.createMany( use ) );
        // });

        // await Promise.all( insertPromises );

          await this.prisma.configuration.create({
            data: configurations[0]
          });
          await this.prisma.configuration.create({
            data: configurations[1]
          });
            // const createdConfiguration = await this.prisma.configuration.findMany();
            const createdConfiguration = await this.prisma.configuration.findMany({
              orderBy: {
                codCon: 'asc', // 👈 ordena 0001, 0002, 0003...
              },
            });
            const CONFIG1 = createdConfiguration[0].id;
            const CONFIG2 = createdConfiguration[1].id;

            await this.prisma.comprobante.createMany({
              data: initialDataVinos.comprobantes.map((c, index) => ({
                ...c,
                codConId: index < 6 ? CONFIG1 : CONFIG2
                // codConId: CONFIG1 
              }))
            });    
            
          await this.prisma.instrumento.createMany({
            data: instrumentos
          });
          await this.prisma.supplier.createMany({
            data: suppliers
          });
          await this.prisma.encargado.createMany({
            data: encargados
          });
          await this.prisma.maquina.createMany({
            data: maquinas
          });
          await this.prisma.customer.createMany({
            data: customers
          });
          await this.prisma.valuee.createMany({
            data: valuees
          });
          await this.prisma.stateOrd.createMany({
            data: estados
          });
          await this.prisma.parte.createMany({
            data: partes
          });

          await this.prisma.user.createMany({
            data: users
          });

          await this.prisma.country.createMany({
            data: countries
          });



          //  Categorias
          // {
          //   name: 'Shirt'
          // }
          const categoriesData = categories.map( (name) => ({ name }));
          
          await this.prisma.category.createMany({
            data: categoriesData
          });

          
          const categoriesDB = await this.prisma.category.findMany();
          
          const categoriesMap = categoriesDB.reduce( (map, category) => {
            map[ category.name.toLowerCase()] = category.id;
            return map;
          }, {} as Record<string, string>); //<string=shirt, string=categoryID>
          
          

          // Productos

          products.forEach( async(product) => {

            const { type, images, ...rest } = product;

            const dbProduct = await this.prisma.product.create({
              data: {
                ...rest,
                categoryId: categoriesMap[type],
                id_config: CONFIG1 
              }
            })


            // Images
            const imagesData = images.map( image => ({
              url: image,
              productId: dbProduct.id
            }));

            await this.prisma.productImage.createMany({
              data: imagesData
            });

          });

        return `Seed completed`;

      } catch (error) {
          this.handleExceptions(error);
        }

  }
  async runSeedVinos() {
    
          
    try {
/////borrado
  await this.prisma.serviceItem.deleteMany();
  await this.prisma.service.deleteMany();
  await this.prisma.orderAddress.deleteMany();
  await this.prisma.orderItem.deleteMany();
  await this.prisma.order.deleteMany();
  await this.prisma.receiptItem.deleteMany();
  await this.prisma.receipt.deleteMany();
  await this.prisma.paramItem.deleteMany();


  await this.prisma.userAddress.deleteMany();
  await this.prisma.user.deleteMany();
  await this.prisma.country.deleteMany();
  
  await this.prisma.productImage.deleteMany();
  await this.prisma.product.deleteMany();
  await this.prisma.category.deleteMany();
  
  await this.prisma.stateOrd.deleteMany();
  await this.prisma.parte.deleteMany();
  await this.prisma.valuee.deleteMany();
  await this.prisma.instrumento.deleteMany();
  await this.prisma.maquina.deleteMany();
  await this.prisma.customer.deleteMany();
  await this.prisma.encargado.deleteMany();
  await this.prisma.supplier.deleteMany();
  await this.prisma.comprobante.deleteMany();
  await this.prisma.configuration.deleteMany();

/////borrado
        console.log('🌱 Running seed...');  


        const { categories, products, users, configurations, estados, partes, valuees, instrumentos, customers, encargados, maquinas, suppliers, } = initialDataVinos;

        // const users = initialData.users;
        

        // const insertPromises = [];
        // users.forEach( use => {
        //   insertPromises.push( this.usersService.createMany( use ) );
        // });

        // await Promise.all( insertPromises );

          await this.prisma.configuration.create({
            data: configurations[0]
          });
          await this.prisma.configuration.create({
            data: configurations[1]
          });
            // const createdConfiguration = await this.prisma.configuration.findMany();
            const createdConfiguration = await this.prisma.configuration.findMany({
              orderBy: {
                codCon: 'asc', // 👈 ordena 0001, 0002, 0003...
              },
            });
            const CONFIG1 = createdConfiguration[0].id;
            const CONFIG2 = createdConfiguration[1].id;

            await this.prisma.comprobante.createMany({
              data: initialDataVinos.comprobantes.map((c, index) => ({
                ...c,
                codConId: index < 6 ? CONFIG1 : CONFIG2
                // codConId: CONFIG1 
              }))
            });    
            
          await this.prisma.instrumento.createMany({
            data: instrumentos
          });
          await this.prisma.supplier.createMany({
            data: suppliers
          });
          await this.prisma.encargado.createMany({
            data: encargados
          });
          await this.prisma.maquina.createMany({
            data: maquinas
          });
          await this.prisma.customer.createMany({
            data: customers
          });
          await this.prisma.valuee.createMany({
            data: valuees
          });
          await this.prisma.stateOrd.createMany({
            data: estados
          });
          await this.prisma.parte.createMany({
            data: partes
          });

          await this.prisma.user.createMany({
            data: users
          });

          await this.prisma.country.createMany({
            data: countries
          });



          //  Categorias
          // {
          //   name: 'Shirt'
          // }
          const categoriesData = categories.map( (name) => ({ name }));
          
          await this.prisma.category.createMany({
            data: categoriesData
          });

          
          const categoriesDB = await this.prisma.category.findMany();
          
          const categoriesMap = categoriesDB.reduce( (map, category) => {
            map[ category.name.toLowerCase()] = category.id;
            return map;
          }, {} as Record<string, string>); //<string=shirt, string=categoryID>
          
          

          // Productos

          products.forEach( async(product) => {

            const { type, images, ...rest } = product;

            const dbProduct = await this.prisma.product.create({
              data: {
                ...rest,
                categoryId: categoriesMap[type],
                id_config: CONFIG1 
              }
            })


            // Images
            const imagesData = images.map( image => ({
              url: image,
              productId: dbProduct.id
            }));

            await this.prisma.productImage.createMany({
              data: imagesData
            });

          });

        return `Seed completed`;

      } catch (error) {
          this.handleExceptions(error);
        }

  }
  
  private handleExceptions( error: any ) {
     console.log(error);
    throw new InternalServerErrorException(`Error en Seed`);
  }



}

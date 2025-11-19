import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductoFacDto } from './dto/create-producto-fac.dto';
import { UpdateProductoFacDto } from './dto/update-producto-fac.dto';

import { PrismaClient, Product } from '@prisma/client';

import { PaginationDto } from 'src/common/dto/pagination.dto';


@Injectable()
export class ProductoFacService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }



  async create(createProductoFacDto: CreateProductoFacDto, product:Product) {
    console.log("crea con imagen")
    console.log(createProductoFacDto)
    console.log("crea con imagen")
    // createProductDto.nameCus = createProductDto.nameCus.toLocaleLowerCase();
  const { _id, supplier, createdAt, updatedAt, reviews, images, ...rest } = createProductoFacDto;
  // if (rest.price) {
  //   rest.price = parseFloat(rest.price as any);
  // }
  try {
      const product = await 
      this.product.create({
        
        data: {
        ...rest,
        supplier: supplier
          ? { connect: { id: supplier } } // 🔗 Prisma busca el UUID del Configuration
          : undefined,

        ProductImage: {
            create: images.map(item => ({
              url: item,
            }))
          }

        },

      });
      return product;
      
    } catch (error) {
      this.handleExceptions( error );
    }


  }

  
  async createFac(createProductoFacDto: CreateProductoFacDto, product:Product) {
    console.log("crea sin imagen")
    console.log(createProductoFacDto)
    console.log("crea sin imagen")
    // createProductDto.nameCus = createProductDto.nameCus.toLocaleLowerCase();
  const { _id, supplier, createdAt, updatedAt, reviews, ...rest } = createProductoFacDto;
  // if (rest.price) {
  //   rest.price = parseFloat(rest.price as any);
  // }
  try {
      const product = await 
      this.product.create({
        
        data: {
        ...rest,
        supplier: supplier
          ? { connect: { id: supplier } } // 🔗 Prisma busca el UUID del Configuration
          : undefined,
      },
      });
      return product;
      
    } catch (error) {
      this.handleExceptions( error );
    }


  }


  async findAll(query: any) {
  // isAuth,
  // // isAdmin,
    const {
      id_config,
    } = query;
    const configuracion = id_config;
    const configuracionFilter =
      configuracion && configuracion !== 'all' ? { id_config: String(configuracion) } : {id_config: null};

    const products = await this.product.findMany({
      where: {
        ...configuracionFilter,
      },
        orderBy: {
          title: 'asc',
        },
      include: {
        supplier: true,
      },        
      })

      // const kiki = products.map(c => ({
      //   _id: c.id,  // duplicamos el id en _id
      //   ...c,
      // }));
      // const kiki = products.map(({ id, ...rest }) => ({
      //   _id: id,
      //   ...rest,
      // }));
      // console.log(kiki)

      return products.map(({ id, ...rest }) => ({
        _id: id,
        ...rest,
      }));

  }

  async findAllCat(query: any) {
    const {
      configuracion,
    } = query;
    const configuracionFilter =
      configuracion && configuracion !== 'all' ? { id_config: String(configuracion) } : {id_config: null};


    const categories = await this.product.groupBy({
        by: ['category'],
      where: {
        ...configuracionFilter,
      },
      });

    return categories.map((c) => c.category);

}
  async dispre(query: any) {

      const {
        porcen,
        codProd2,
        codProd1,
        supplier,
        category,
        configuracion,
      } = query;

          // --- Otros filtros ---
          const supplierFilter = supplier && supplier !== 'all' ? { supplierId: String(supplier) } : {};
          const categoryFilter = category && category !== 'all' ? { category: category } : {};
          const configuracionFilter =
          configuracion && configuracion !== 'all' ? { id_config: String(configuracion) } : {};

          // const productFilter = product && product !== 'all' ? { id_product: String(product) } : {};
          const productsFilter =
          !codProd1 && !codProd2 ? {}
        : !codProd1 && codProd2 ? {
                      codigoPro: {
                        lte: codProd2,
                      },
                    }
        : codProd1 && !codProd2 ? {
                      codigoPro: {
                        gte: codProd1,
                      },
                    }
        :                   {
                      codigoPro: {
                        gte: codProd1,
                        lte: codProd2,
                      },
                    };

  try {
          const products = await this.product.findMany({
            where: {
              ...productsFilter,
              ...supplierFilter,
              ...configuracionFilter,
              ...categoryFilter,
            },

            })

        await Promise.all(
          products.map(async (product) => {
            const newPrice = parseFloat(
              (product.price / (1 + porcen / 100)).toFixed(2)
            );

            return this.product.update({
              where: { id: product.id },
              data: { price: newPrice },
            });
          })
        );

  } catch (error) {
    this.handleExceptions(error);
  }


}


  async findOne(id: string) {
    let productT;
    if ( id ) {
      productT = await this.product.findFirst({
        where: { slug : id },
        include: {
          supplier: true,
          ProductImage: true,
          reviews: true,
        },        

      });
    }
    
    if ( !productT ) 
      throw new NotFoundException(`Product with id, name or no "${ id }" not found`);
    
    (productT as any)._id = productT.id;
    console.log(productT)
    // return productT;

    const { images = [], ProductImage, ...rest } = productT;
    return {
      ...rest,
      images: ProductImage.map( image => image.url )
    }


  }
async update(updateProductoFacDto: UpdateProductoFacDto) {
  const { _id, supplier, reviews, images, ...rest } = updateProductoFacDto;

  try {
    const product = await this.product.update({
      where: { id: _id },

      data: {
        ...rest,
          ...(reviews && {
      reviews: {
        create: reviews.map(r => ({
          name: r.name,
          comment: r.comment,
          rating: r.rating,
        })),
      },
    }),

        // 🔗 Supplier (si viene)
        supplier: supplier
          ? { connect: { id: supplier } }
          : undefined,

        // 🖼️ ProductImage (borrar todas y cargar nuevas)
        ProductImage: images
          ? {
              deleteMany: {}, // elimina todas las imágenes anteriores

              create: images.map(url => ({
                url,
              }))
            }
          : undefined,
      },

      include: {
        ProductImage: true,
      },
    });

    return product;

  } catch (error) {
    this.handleExceptions(error);
  }
}

async updateFac(updateProductoFacDto: UpdateProductoFacDto) {
  const { _id, supplier, reviews, ...rest } = updateProductoFacDto;

  const data: any = {
    ...rest,
        supplier: supplier
          ? { connect: { id: supplier } } // 🔗 Prisma busca el UUID del Configuration
          : { disconnect: true },
          ...(reviews && {
      reviews: {
        create: reviews.map(r => ({
          name: r.name,
          comment: r.comment,
          rating: r.rating,
        })),
      },
    }),
  };

  try {
    const updated = await this.product.update({
      where: { id: _id }, // Prisma usa 'id'
      data,
    });

    // Devolver _id para compatibilidad con frontend
    return { _id: updated.id, ...updated };
  } catch (error: any) {
    // Violación de unique constraint
    if (error.code === 'P2002') {
      throw new BadRequestException(
        `Ya existe un Product con valor duplicado para: ${error.meta?.target}`,
      );
    }
    // Registro no encontrado
    if (error.code === 'P2025') {
      throw new NotFoundException(`Product con id "${_id}" no encontrado`);
    }
    throw error;
  }
}

async downstock(id: string, updateProductoFacDto: any) {


        const product = await this.product.findUnique(
          {
            where: { id: id },
          }
        );
        if (product) {
          await this.product.update(
            {
              where: { id: id },
              data: {
                inStock: { decrement: updateProductoFacDto.quantitys },
              },
            }
          );
        } else {
          throw new Error('Product no encontrada');
        }
  
};
async upstock(id: string, updateProductoFacDto: any) {


        const product = await this.product.findUnique(
          {
            where: { id: id },
          }
        );
        if (product) {
          await this.product.update(
            {
              where: { id: id },
              data: {
                inStock: { increment: updateProductoFacDto.quantitys },
              },
            }
          );
        } else {
          throw new Error('Product no encontrada');
        }
  
};




// async remove(id: string) {
//   try {
//     await this.product.delete({
//       where: { id },
//     });
//     return { message: `Product con id ${id} eliminado` };
//   } catch (error) {
//     if (error.code === 'P2025') {
//       throw new BadRequestException(`Product con id "${id}" no encontrado`);
//     }
//     throw error; // otros errores
//   }
// }

  private handleExceptions( error: any ) {
    if ( error.code === 11000 ) {
      throw new BadRequestException(`Product exists in db ${ JSON.stringify( error.keyValue ) }`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create Product - Check server logs`);
  }



}

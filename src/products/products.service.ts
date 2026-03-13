import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Product } from '@prisma/client';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';


@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }



  async create(createProductDto: CreateProductDto, product:Product) {
    // createProductDto.nameCus = createProductDto.nameCus.toLocaleLowerCase();
  const { _id, supplier, createdAt, updatedAt, reviews,categoryId, id_config, ...rest } = createProductDto;
  // if (rest.price) {
  //   rest.price = parseFloat(rest.price as any);
  // }
  try {
      const product = await 
      // this.product.create({data:rest});
      this.product.create({data:{
          ...rest,

        // 🔗 Supplier (si viene)
          supplier: supplier
          ? { connect: { id: supplier } }
          : undefined,
          
          codCon: id_config
          ? { connect: { id: id_config } } // 🔗 Prisma busca el UUID del Configuration
          : undefined,

          categorys: categoryId
          ? { connect: { id: categoryId } }
          : undefined,
      }
      });
      return product;
      
    } catch (error) {
      this.handleExceptions( error );
    }


  }

  async findAllEcoReac25(paginationDto: PaginationDto) {
  const {
    limit = 10,
    offset = 0,
    gender = '',
    minPrice,
    maxPrice,
    sizes,
    q: query,
  } = paginationDto;

  const data = await this.configuration.findFirst({
      where: { codCon : "0001" },
  });
  const configuracion = data.id;

    const configuracionFilter =
      configuracion && configuracion !== 'all' ? { id_config: String(configuracion) } : {id_config: null};


  const sizesArray = sizes ? sizes.toUpperCase().split(',') : undefined;

  // Prisma price filter builder
  const priceFilter =
    minPrice !== undefined && maxPrice !== undefined
      ? { gte: minPrice, lte: maxPrice }
      : minPrice !== undefined
      ? { gte: minPrice }
      : maxPrice !== undefined
      ? { lte: maxPrice }
      : undefined;

  const where: any = {
    ...configuracionFilter,
    ecoActive : true,
    gender: gender || undefined,
    price: priceFilter,
    sizes: sizesArray ? { hasEvery: sizesArray } : undefined,
    title: query
      ? {
          contains: query,
          mode: 'insensitive',
        }
      : undefined,
  };
  const [products, totalProducts] = await Promise.all([
    this.product.findMany({
      take: limit,
      skip: offset,
      where,
      include: {
        ProductImage: true,
      },
      orderBy: {
        id: 'asc',
      },
    }),

    this.product.count({ where }),
  ]);


  return {
    count: totalProducts,
    pages: Math.ceil(totalProducts / limit),
    products: products.map((product) => ({
        _id: product.id,
      ...product,
      images: product.ProductImage.map((img) => img.url),
    })),
  };
  // return {
  //   products: products.map((product) => ({
  //       _id: product.id,
  //     ...product,
  //     images: product.ProductImage.map((img) => img.url),
  //   })),
  // };

      // return products.map(({ id, ProductImage, ...rest }) => ({
      //   _id: id,
      //   ...rest,
      // images: ProductImage.map( image => image.url )
      // }));
}

  async findAllEco(paginationDto: PaginationDto) {
  const {
    limit = 10,
    offset = 0,
    gender = '',
    minPrice,
    maxPrice,
    sizes,
    q: query,
  } = paginationDto;

  const data = await this.configuration.findFirst({
      where: { codCon : "0001" },
  });
  const configuracion = data.id;
  console.log("configuracion")
  console.log(configuracion)
  console.log("configuracion")
    const configuracionFilter =
      configuracion && configuracion !== 'all' ? { id_config: String(configuracion) } : {id_config: null};


  const sizesArray = sizes ? sizes.toUpperCase().split(',') : undefined;

  // Prisma price filter builder
  const priceFilter =
    minPrice !== undefined && maxPrice !== undefined
      ? { gte: minPrice, lte: maxPrice }
      : minPrice !== undefined
      ? { gte: minPrice }
      : maxPrice !== undefined
      ? { lte: maxPrice }
      : undefined;

  const where: any = {
    ...configuracionFilter,
    ecoActive : true,
    gender: gender || undefined,
    price: priceFilter,
    sizes: sizesArray ? { hasEvery: sizesArray } : undefined,
    title: query
      ? {
          contains: query,
          mode: 'insensitive',
        }
      : undefined,
  };
  const [products, totalProducts] = await Promise.all([
    this.product.findMany({
      // take: limit,
      // skip: offset,
      where,
      include: {
        ProductImage: {
          take: 2,
          select: {
            url: true,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    }),

    this.product.count({ where }),
  ]);


  // return {
  //   count: totalProducts,
  //   pages: Math.ceil(totalProducts / limit),
  //   products: products.map((product) => ({
  //       _id: product.id,
  //     ...product,
  //     images: product.ProductImage.map((img) => img.url),
  //   })),
  // };
  // return {
  //   products: products.map((product) => ({
  //       _id: product.id,
  //     ...product,
  //     images: product.ProductImage.map((img) => img.url),
  //   })),
  // };

      return products.map(({ id, ProductImage, ...rest }) => ({
        _id: id,
        ...rest,
      // images: ProductImage.map( image => image.url )
      images: ProductImage.map(
         image => image.url.includes('http') ? image.url : `${ process.env.HOST_NAME}/PRODUCTS/${ image.url }`
         )


    }));
}



  // async findAll(query: any) {
  async findAll() {

  const data = await this.configuration.findFirst({
      where: { codCon : "0001" },
  });
  const configuracion = data.id;

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
        ProductImage: true,
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

      return products.map(({ id, ProductImage, ...rest }) => ({
        _id: id,
        ...rest,
      // images: ProductImage.map( image => image.url )
      images: ProductImage.map(
                 image => image.url.includes('http') ? image.url : `${ process.env.HOST_NAME}/PRODUCTS/${ image.url }`
      )
      }));

  }


  async updateecoActive(updateProductDto: UpdateProductDto) {
    const { productId, ...data } = updateProductDto;
    try {
      const updated = await this.product.update({
        where: { id: productId }, // Prisma usa 'id'
              data: {
            ecoActive: updateProductDto.ecoActive,
          },
      });
  
      // Devolver _id para compatibilidad con frontend
      return { _id: updated.id, ...updated };
    } catch (error) {
      throw error;
    }
  }
  

async update(updateProductDto: UpdateProductDto) {
  const { _id, reviews, ...rest } = updateProductDto;
  // if (rest.price) {
  //   rest.price = parseFloat(rest.price as any);
  // }
  // Prepara los datos para Prisma
  const data: any = {
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


async remove(id: string) {
  try {
    await this.product.delete({
      where: { id },
    });
    return { message: `Product con id ${id} eliminado` };
  } catch (error) {
    if (error.code === 'P2003') {
      throw new BadRequestException(
        'No se puede eliminar este Producto/Diligencia porque está siendo Utilizado.'
      );
    }
    if (error.code === 'P2025') {
      throw new BadRequestException(`Product con id "${id}" no encontrado`);
    }
    throw error; // otros errores
  }
}

  private handleExceptions( error: any ) {
    if ( error.code === 11000 ) {
      throw new BadRequestException(`Product exists in db ${ JSON.stringify( error.keyValue ) }`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create Product - Check server logs`);
  }



}

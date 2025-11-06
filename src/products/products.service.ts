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
  const { _id, supplier, createdAt, updatedAt, reviews, ...rest } = createProductDto;
  // if (rest.price) {
  //   rest.price = parseFloat(rest.price as any);
  // }
  try {
      const product = await 
      this.product.create({data:rest});
      return product;
      
    } catch (error) {
      this.handleExceptions( error );
    }


  }

  // async findAll(query: any) {
  async findAll() {

  const data = await this.configuration.findMany();
  const configuracion = data[0].id;

    const configuracionFilter =
      configuracion && configuracion !== 'all' ? { id_config: String(configuracion) } : {id_config: null};

    const products = await this.product.findMany({
      where: {
        ...configuracionFilter,
      },
        orderBy: {
          title: 'asc',
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

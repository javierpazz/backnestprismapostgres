import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common';
import { PrismaClient, Instrumento } from '@prisma/client';
import { CreateInstrumentoDto } from './dto/create-instrumento.dto';
import { UpdateInstrumentoDto } from './dto/update-instrumento.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateParamsDto } from './dto/create-params.dto';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
// export class InstrumentosService extends PrismaClient implements OnModuleInit {
//   async onModuleInit() {
//     await this.$connect();
//   }
export class InstrumentosService {

  constructor(private prisma: PrismaService) {}


  async findAllEco(paginationDto: PaginationDto) {



  // const where: any = {
  //   ecoActive : true,
  // };

  const [instrumentos, totalProducts] = await Promise.all([
    this.prisma.instrumento.findMany({
      // where,
      // include: {
      //   ProductImage: {
      //     take: 2,
      //     select: {
      //       url: true,
      //     },
      //   },
      // },
      orderBy: {
        id: 'asc',
      },
    }),

    // this.prisma.product.count({ where }),
    this.prisma.instrumento.count(),
  ]);

      return instrumentos.map(({ id, ...rest }) => ({
        _id: id,
        ...rest,


    }));
}


  async create(createInstrumentoDto: CreateInstrumentoDto, instrumento:Instrumento) {
    // createInstrumentoDto.nameCus = createInstrumentoDto.nameCus.toLocaleLowerCase();
    const { _id, ...rest } = createInstrumentoDto;
    try {
      const instrumento = await 
      this.prisma.instrumento.create({data:rest});
      return instrumento;
      
    } catch (error) {
      this.handleExceptions( error );
    }


  }

  async findAll() {
  // isAuth,
  // // isAdmin,

    const instrumentos = await this.prisma.instrumento.findMany({
        orderBy: {
          name: 'asc',
        },
        include: {
          paramItems: true,
        },        
      })
      // return instrumentos.map(c => ({
      //   _id: c.id,  // duplicamos el id en _id
      //   ...c,
      // }));
  return instrumentos.map((ins) => ({
    ...ins,
    _id: ins.id,
    paramItems: ins.paramItems.map((oi) => ({
      ...oi,
      _id: oi.productId,      // 👈 duplicamos el id
    })),
  }));
  }

  async findOne(id: string) {
    
    let instrumento: Instrumento;
    if ( id ) {
      instrumento = await this.prisma.instrumento.findUnique({
      where: { id },
        include: {
          paramItems: true,
        },        
 
      });
    }

    if ( !instrumento ) 
      throw new NotFoundException(`Instrumento with id, name or no "${ id }" not found`);
    
    // (instrumento as any)._id = instrumento.id;
    // return instrumento;

  return {
    ...instrumento,
    _id: instrumento.id,
    paramItems: (instrumento as any).paramItems.map((oi) => ({
      ...oi,
      _id: oi.productId, // 👈 igual que en findAll
    })),
  };


  }

async update(updateInstrumentoDto: UpdateInstrumentoDto) {
  const { _id, ...data } = updateInstrumentoDto;



  try {
    const updated = await this.prisma.instrumento.update({
      where: { id: _id }, // Prisma usa 'id'
      data,
    });

    // Devolver _id para compatibilidad con frontend
    return { _id: updated.id, ...updated };
  } catch (error) {
    // Unique constraint violation
    if (error.code === 'P2002') {
      throw new BadRequestException(
        `Ya existe un Instrumento con valor duplicado para: ${error.meta?.target}`,
      );
    }
    // Instrumento no encontrado
    if (error.code === 'P2025') {
      throw new NotFoundException(`Instrumento con id "${_id}" no encontrado`);
    }
    throw error;
  }
}

  async updateDet(createParamsDto: any) {
    const instrumentoB = await this.findOne( createParamsDto.body._id );
    const { _id, ...data } = createParamsDto.body;

    try {
      await this.prisma.instrumento.update(
            ({
          where: { id: _id }, // Prisma usa 'id'
        data: {
          paramItems: {
            deleteMany: {instrumentoId: _id}, // borra todos los actuales
            create: createParamsDto.body.paramItems?.map((oi) => ({
              title: oi.title,
              medPro: oi.medPro,
              quantity: oi.quantity,
              price: oi.price,
              porIva: oi.porIva,
              venDat: oi.venDat,
              observ: oi.observ,
              slug: oi.slug,
              size: oi.size,
              terminado: oi.terminado,
              productId: oi._id,
            })),
          },
        },
        // include: {
        //   paramItems: { include: { product: true } },
        // },
       })
      );
      return { createParamsDto };
      
    } catch (error) {
      this.handleExceptions( error );
    }
  }


async remove(id: string) {
  try {
    await this.prisma.paramItem.deleteMany({
      where: { instrumentoId: id },
    });
    await this.prisma.instrumento.delete({
      where: { id },
    });
    return { message: `Instrumento con id ${id} eliminado` };
  } catch (error) {
    if (error.code === 'P2003') {
      throw new BadRequestException(
        'No se puede eliminar este Instrumento porque está siendo Utilizado.'
      );
    }
    if (error.code === 'P2025') {
      throw new BadRequestException(`Instrumento con id "${id}" no encontrado`);
    }
    throw error; // otros errores
  }
}

  private handleExceptions( error: any ) {
    if ( error.code === 11000 ) {
      throw new BadRequestException(`Instrumento exists in db ${ JSON.stringify( error.keyValue ) }`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create Instrumento - Check server logs`);
  }



}

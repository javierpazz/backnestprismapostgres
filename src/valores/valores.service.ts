import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Valuee } from '@prisma/client';


import { CreateValoreDto } from './dto/create-valore.dto';
import { UpdateValoreDto } from './dto/update-valore.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
// export class ValoresService extends PrismaClient implements OnModuleInit {
//   async onModuleInit() {
//     await this.$connect();
//   }
export class ValoresService {

  constructor(private prisma: PrismaService) {}


  async create(createValoreDto: CreateValoreDto) {
    // createValoreDto.nameCus = createValoreDto.nameCus.toLocaleLowerCase();
    const { _id, ...rest } = createValoreDto;
    try {
      const valuee = await 
      this.prisma.valuee.create({data:rest});
      return valuee;
      
    } catch (error) {
      this.handleExceptions( error );
    }


  }

  async findAll() {
  // isAuth,
  // // isAdmin,

    const valuees = await this.prisma.valuee.findMany({
        orderBy: {
          desVal: 'asc',
        },
      })
      return valuees.map(c => ({
        _id: c.id,  // duplicamos el id en _id
        ...c,
      }));

  }

  async findOne(id: string) {
    
    let valuee: Valuee;
    if ( id ) {
      valuee = await this.prisma.valuee.findUnique({
      where: { id },
      });
    }

    if ( !valuee ) 
      throw new NotFoundException(`Valuee with id, name or no "${ id }" not found`);
    
    (valuee as any)._id = valuee.id;
    return valuee;
  }

async update(updateValoreDto: UpdateValoreDto) {
  const { _id, ...data } = updateValoreDto;



  try {
    const updated = await this.prisma.valuee.update({
      where: { id: _id }, // Prisma usa 'id'
      data,
    });

    // Devolver _id para compatibilidad con frontend
    return { _id: updated.id, ...updated };
  } catch (error) {
    // Unique constraint violation
    if (error.code === 'P2002') {
      throw new BadRequestException(
        `Ya existe un Valuee con valor duplicado para: ${error.meta?.target}`,
      );
    }
    // Valuee no encontrado
    if (error.code === 'P2025') {
      throw new NotFoundException(`Valuee con id "${_id}" no encontrado`);
    }
    throw error;
  }
}


async remove(id: string) {
  try {
    await this.prisma.valuee.delete({
      where: { id },
    });
    return { message: `Valuee con id ${id} eliminado` };
  } catch (error) {
    if (error.code === 'P2003') {
      throw new BadRequestException(
        'No se puede eliminar este Valor porque está siendo Utilizado.'
      );
    }
    if (error.code === 'P2025') {
      throw new BadRequestException(`Valuee con id "${id}" no encontrado`);
    }
    throw error; // otros errores
  }
}

  private handleExceptions( error: any ) {
    if ( error.code === 11000 ) {
      throw new BadRequestException(`Valuee exists in db ${ JSON.stringify( error.keyValue ) }`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create Valuee - Check server logs`);
  }



}

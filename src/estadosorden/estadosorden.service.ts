import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaClient, StateOrd } from '@prisma/client';


import { CreateEstadosordenDto } from './dto/create-estadosorden.dto';
import { UpdateEstadosordenDto } from './dto/update-estadosorden.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';


@Injectable()
export class EstadosordenService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }



  async create(createEstadosordenDto: CreateEstadosordenDto, stateOrd:StateOrd) {
    // createEstadosOrdenDto.nameCus = createEstadosOrdenDto.nameCus.toLocaleLowerCase();
    const { _id, ...rest } = createEstadosordenDto;
    try {
      const stateOrd = await 
      this.stateOrd.create({data:rest});
      return stateOrd;
      
    } catch (error) {
      this.handleExceptions( error );
    }


  }

  async findAll() {
  // isAuth,
  // // isAdmin,

    const estadosOrden = await this.stateOrd.findMany({
        orderBy: {
          name: 'asc',
        },
      })
      return estadosOrden.map(c => ({
        _id: c.id,  // duplicamos el id en _id
        ...c,
      }));

  }

  async findOne(id: string) {
    
    let stateOrd: StateOrd;
    if ( id ) {
      stateOrd = await this.stateOrd.findUnique({
      where: { id },
      });
    }

    if ( !stateOrd ) 
      throw new NotFoundException(`EstadosOrden with id, name or no "${ id }" not found`);
    
    (stateOrd as any)._id = stateOrd.id;
    return stateOrd;
  }

async update(updateEstadosordenDto: UpdateEstadosordenDto) {
  const { _id, ...data } = updateEstadosordenDto;



  try {
    const updated = await this.stateOrd.update({
      where: { id: _id }, // Prisma usa 'id'
      data,
    });

    // Devolver _id para compatibilidad con frontend
    return { _id: updated.id, ...updated };
  } catch (error) {
    // Unique constraint violation
    if (error.code === 'P2002') {
      throw new BadRequestException(
        `Ya existe un EstadosOrden con valor duplicado para: ${error.meta?.target}`,
      );
    }
    // EstadosOrden no encontrado
    if (error.code === 'P2025') {
      throw new NotFoundException(`EstadosOrden con id "${_id}" no encontrado`);
    }
    throw error;
  }
}


async remove(id: string) {
  try {
    await this.stateOrd.delete({
      where: { id },
    });
    return { message: `EstadosOrden con id ${id} eliminado` };
  } catch (error) {
    if (error.code === 'P2025') {
      throw new BadRequestException(`EstadosOrden con id "${id}" no encontrado`);
    }
    throw error; // otros errores
  }
}

  private handleExceptions( error: any ) {
    if ( error.code === 11000 ) {
      throw new BadRequestException(`EstadosOrden exists in db ${ JSON.stringify( error.keyValue ) }`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create EstadosOrden - Check server logs`);
  }



}

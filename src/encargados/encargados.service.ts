import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Encargado } from '@prisma/client';


import { CreateEncargadoDto } from './dto/create-encargado.dto';
import { UpdateEncargadoDto } from './dto/update-encargado.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';


@Injectable()
export class EncargadosService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }



  async create(createEncargadoDto: CreateEncargadoDto, encargado:Encargado) {
    // createEncargadoDto.nameCus = createEncargadoDto.nameCus.toLocaleLowerCase();
    const { _id, ...rest } = createEncargadoDto;
    try {
      const encargado = await 
      this.encargado.create({data:rest});
      return encargado;
      
    } catch (error) {
      this.handleExceptions( error );
    }


  }

  async findAll() {
  // isAuth,
  // // isAdmin,

    const encargados = await this.encargado.findMany({
        orderBy: {
          name: 'asc',
        },
      })
      return encargados.map(c => ({
        _id: c.id,  // duplicamos el id en _id
        ...c,
      }));

  }

  async findOne(id: string) {
    
    let encargado: Encargado;
    if ( id ) {
      encargado = await this.encargado.findUnique({
      where: { id },
      });
    }

    if ( !encargado ) 
      throw new NotFoundException(`Encargado with id, name or no "${ id }" not found`);
    
    (encargado as any)._id = encargado.id;
    return encargado;
  }

async update(updateEncargadoDto: UpdateEncargadoDto) {
  const { _id, ...data } = updateEncargadoDto;



  try {
    const updated = await this.encargado.update({
      where: { id: _id }, // Prisma usa 'id'
      data,
    });

    // Devolver _id para compatibilidad con frontend
    return { _id: updated.id, ...updated };
  } catch (error) {
    // Unique constraint violation
    if (error.code === 'P2002') {
      throw new BadRequestException(
        `Ya existe un Encargado con valor duplicado para: ${error.meta?.target}`,
      );
    }
    // Encargado no encontrado
    if (error.code === 'P2025') {
      throw new NotFoundException(`Encargado con id "${_id}" no encontrado`);
    }
    throw error;
  }
}


async remove(id: string) {
  try {
    await this.encargado.delete({
      where: { id },
    });
    return { message: `Encargado con id ${id} eliminado` };
  } catch (error) {
    if (error.code === 'P2025') {
      throw new BadRequestException(`Encargado con id "${id}" no encontrado`);
    }
    throw error; // otros errores
  }
}

  private handleExceptions( error: any ) {
    if ( error.code === 11000 ) {
      throw new BadRequestException(`Encargado exists in db ${ JSON.stringify( error.keyValue ) }`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create Encargado - Check server logs`);
  }



}

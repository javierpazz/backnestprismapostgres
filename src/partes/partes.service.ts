import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Parte } from '@prisma/client';


import { CreateParteDto } from './dto/create-parte.dto';
import { UpdateParteDto } from './dto/update-parte.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';


@Injectable()
export class PartesService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }



  async create(createParteDto: CreateParteDto, parte:Parte) {
    // createParteDto.nameCus = createParteDto.nameCus.toLocaleLowerCase();
    const { _id, ...rest } = createParteDto;
    try {
      const parte = await 
      this.parte.create({data:rest});
      return parte;
      
    } catch (error) {
      this.handleExceptions( error );
    }


  }

  async findAll() {
  // isAuth,
  // // isAdmin,

    const partes = await this.parte.findMany({
        orderBy: {
          name: 'asc',
        },
      })
      return partes.map(c => ({
        _id: c.id,  // duplicamos el id en _id
        ...c,
      }));

  }

  async findOne(id: string) {
    
    let parte: Parte;
    if ( id ) {
      parte = await this.parte.findUnique({
      where: { id },
      });
    }

    if ( !parte ) 
      throw new NotFoundException(`Parte with id, name or no "${ id }" not found`);
    
    (parte as any)._id = parte.id;
    return parte;
  }

async update(updateParteDto: UpdateParteDto) {
  const { _id, ...data } = updateParteDto;



  try {
    const updated = await this.parte.update({
      where: { id: _id }, // Prisma usa 'id'
      data,
    });

    // Devolver _id para compatibilidad con frontend
    return { _id: updated.id, ...updated };
  } catch (error) {
    // Unique constraint violation
    if (error.code === 'P2002') {
      throw new BadRequestException(
        `Ya existe un Parte con valor duplicado para: ${error.meta?.target}`,
      );
    }
    // Parte no encontrado
    if (error.code === 'P2025') {
      throw new NotFoundException(`Parte con id "${_id}" no encontrado`);
    }
    throw error;
  }
}


async remove(id: string) {
  try {
    await this.parte.delete({
      where: { id },
    });
    return { message: `Parte con id ${id} eliminado` };
  } catch (error) {
    if (error.code === 'P2025') {
      throw new BadRequestException(`Parte con id "${id}" no encontrado`);
    }
    throw error; // otros errores
  }
}

  private handleExceptions( error: any ) {
    if ( error.code === 11000 ) {
      throw new BadRequestException(`Parte exists in db ${ JSON.stringify( error.keyValue ) }`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create Parte - Check server logs`);
  }



}

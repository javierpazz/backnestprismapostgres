import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Comprobante } from '@prisma/client';


import { CreateComprobanteDto } from './dto/create-comprobante.dto';
import { UpdateComprobanteDto } from './dto/update-comprobante.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';


@Injectable()
export class ComprobanteService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }



  async create(createComprobanteDto: CreateComprobanteDto, comprobante:Comprobante) {
    // createComprobanteDto.nameCus = createComprobanteDto.nameCus.toLocaleLowerCase();
    const { _id, codCon, ...rest } = createComprobanteDto;
    try {
      const comprobante = await 
      this.comprobante.create({

        data: {
        ...rest,
        codCon: codCon
          ? { connect: { id: codCon } } // 🔗 Prisma busca el UUID del Configuration
          : undefined,
      },

      });
      return comprobante;
      
    } catch (error) {
      this.handleExceptions( error );
    }


  }

  async findAll() {
  // isAuth,
  // // isAdmin,

    const comprobantes = await this.comprobante.findMany({
        orderBy: {
          nameCom: 'asc',
        },
      })
      return comprobantes.map(c => ({
        _id: c.id,  // duplicamos el id en _id
        ...c,
      }));

  }

  async findOne(id: string) {
    
    let comprobante: Comprobante;
    if ( id ) {
      comprobante = await this.comprobante.findUnique({
      where: { id },
      });
    }

    if ( !comprobante ) 
      throw new NotFoundException(`Comprobante with id, name or no "${ id }" not found`);
    
    (comprobante as any)._id = comprobante.id;
    return comprobante;
  }

async update(updateComprobanteDto: UpdateComprobanteDto) {

      console.log("updateComprobanteDto")
console.log(updateComprobanteDto)
console.log("updateComprobanteDto")

  const { _id, codCon, ...rest } = updateComprobanteDto;

  try {
    const updated = await this.comprobante.update({
      where: { id: _id },
      data: {
            nameCom: updateComprobanteDto.nameCom,
            claCom: updateComprobanteDto.claCom,
            isHaber: updateComprobanteDto.isHaber,
            noDisc: updateComprobanteDto.noDisc,
            toDisc: updateComprobanteDto.toDisc,
            itDisc: updateComprobanteDto.itDisc,
            interno: updateComprobanteDto.interno,
            numInt: updateComprobanteDto.numInt,
        ...(codCon
          ? { codCon: { connect: { id: codCon } } } 
          : {}), // conecta la relación si viene codCon
      },
    });

    return { _id: updated.id, ...updated };
  } catch (error) {
    if (error.code === 'P2002') {
      throw new BadRequestException(
        `Ya existe un Comprobante con valor duplicado para: ${error.meta?.target}`,
      );
    }
    if (error.code === 'P2025') {
      throw new NotFoundException(`Comprobante con id "${_id}" no encontrado`);
    }
    console.error(error);
    throw new BadRequestException('Error al actualizar el comprobante');
  }
}



async remove(id: string) {
  try {
    await this.comprobante.delete({
      where: { id },
    });
    return { message: `Comprobante con id ${id} eliminado` };
  } catch (error) {
    if (error.code === 'P2025') {
      throw new BadRequestException(`Comprobante con id "${id}" no encontrado`);
    }
    throw error; // otros errores
  }
}

  private handleExceptions( error: any ) {
    if ( error.code === 11000 ) {
      throw new BadRequestException(`Comprobante exists in db ${ JSON.stringify( error.keyValue ) }`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create Comprobante - Check server logs`);
  }



}

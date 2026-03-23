import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Comprobante } from '@prisma/client';


import { CreateComprobanteDto } from './dto/create-comprobante.dto';
import { UpdateComprobanteDto } from './dto/update-comprobante.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
// export class ComprobanteService extends PrismaClient implements OnModuleInit {
//   async onModuleInit() {
//     await this.$connect();
//   }
export class ComprobanteService {

  constructor(private prisma: PrismaService) {}

  async create(createComprobanteDto: CreateComprobanteDto, comprobante:Comprobante) {
    // createComprobanteDto.nameCus = createComprobanteDto.nameCus.toLocaleLowerCase();
    const { _id, codCon, codCom, ...rest } = createComprobanteDto;
    try {
      const comprobante = await 
      this.prisma.comprobante.create({

        data: {
        ...rest,
        codComC: createComprobanteDto.codCom,
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

  async findAll(query: any) {
    // isAuth,
    // // isAdmin,
    const {
      isHaber,
      id_config,
    } = query;
    // console.log(isHaber)
    // const Haber = JSON.parse(isHaber) || '';
    // console.log(Haber)
    const Haber = isHaber ? JSON.parse(isHaber) : '';
    const HaberFilter =
        Haber && Haber !== 'all'
          ? {
            isHaber: Haber
            }
          : {};

    const configuracion = id_config;
    const configuracionFilter =
      configuracion && configuracion !== 'all' ? { codConId: String(configuracion) } : {codConId: null};


    const comprobantes = await this.prisma.comprobante.findMany({
        where: {
        ...HaberFilter,
        ...configuracionFilter,
      },
        orderBy: {
          nameCom: 'asc',
        },
      })
      return comprobantes.map(c => ({
        _id: c.id,  // duplicamos el id en _id
        codCom: c.codComC,
        ...c,
      }));

  }

  async findOne(id: string) {
    
    let comprobante: Comprobante;
    if ( id ) {
      comprobante = await this.prisma.comprobante.findUnique({
      where: { id },
      });
    }

    if ( !comprobante ) 
      throw new NotFoundException(`Comprobante with id, name or no "${ id }" not found`);
    
    (comprobante as any)._id = comprobante.id;
    (comprobante as any).codCom = comprobante.codComC;

    return comprobante;
  }

async update(updateComprobanteDto: UpdateComprobanteDto) {


  const { _id, codCon, ...rest } = updateComprobanteDto;

  try {
    const updated = await this.prisma.comprobante.update({
      where: { id: _id },
      data: {
            nameCom: updateComprobanteDto.nameCom,
            codComC: updateComprobanteDto.codCom,
            claCom: updateComprobanteDto.claCom,
            isHaber: updateComprobanteDto.isHaber,
            isAjuste: updateComprobanteDto.isAjuste,
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
    await this.prisma.comprobante.delete({
      where: { id },
    });
    return { message: `Comprobante con id ${id} eliminado` };
  } catch (error) {
    if (error.code === 'P2003') {
      throw new BadRequestException(
        'No se puede eliminar este Comprobante porque está siendo Utilizado.'
      );
    }
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

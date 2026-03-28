import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Maquina } from '@prisma/client';

import { CreateMaquinaDto } from './dto/create-maquina.dto';
import { UpdateMaquinaDto } from './dto/update-maquina.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MaquinasService {

  constructor(private prisma: PrismaService) {}



  async create(createMaquinaDto: CreateMaquinaDto, maquina:Maquina) {
    // createComprobanteDto.nameCus = createComprobanteDto.nameCus.toLocaleLowerCase();
    const { _id, codCus, codMaq, ...rest } = createMaquinaDto;
    try {
      const maquina = await 
      this.prisma.maquina.create({

        data: {
        ...rest,
        codMaq: createMaquinaDto.codMaq,
        serNum: createMaquinaDto.serNum,
        codCus: codCus
          ? { connect: { id: codCus } } // 🔗 Prisma busca el UUID del Configuration
          : undefined,
      },

      });
      return maquina;
      
    } catch (error) {
      this.handleExceptions( error );
    }


  }



  // findAll() {
  //   return `This action returns all maquinas`;
  // }


  async findAll(query: any) {
    // isAuth,
    // // isAdmin,
    const {
      id_custom,
    } = query;
    // const Haber = JSON.parse(isHaber) || '';
    // console.log(Haber)

    const customer = id_custom;
    const customerFilter =
      customer && customer !== 'all' ? { codCusId: String(customer) } : {codCusId: null};


    const maquinas = await this.prisma.maquina.findMany({
        where: {
        ...customerFilter,
      },
        orderBy: {
          name: 'asc',
        },
      })
      return maquinas.map(c => ({
        _id: c.id,  // duplicamos el id en _id
        codMaq: c.codMaq,
        ...c,
      }));

  }


  async findOne(id: string) {
    
    let maquina: Maquina;
    if ( id ) {
      maquina = await this.prisma.maquina.findUnique({
      where: { id },
      });
    }

    if ( !maquina ) 
      throw new NotFoundException(`Comprobante with id, name or no "${ id }" not found`);
    
    (maquina as any)._id = maquina.id;
    (maquina as any).codMaq = maquina.codMaq;

    return maquina;
  }


  // update(id: number, updateMaquinaDto: UpdateMaquinaDto) {
  //   return `This action updates a #${id} maquina`;
  // }

async update(updateMaquinaDto: UpdateMaquinaDto) {


  const { _id, codCus, ...rest } = updateMaquinaDto;

  try {
    const updated = await this.prisma.maquina.update({
      where: { id: _id },
      data: {
            name: updateMaquinaDto.name,
            codMaq: updateMaquinaDto.codMaq,
            serNum: updateMaquinaDto.serNum,
        ...(codCus
          ? { codCus: { connect: { id: codCus } } } 
          : {}), // conecta la relación si viene codCus
      },
    });

    return { _id: updated.id, ...updated };

  } catch (error) {
    if (error.code === 'P2002') {
      throw new BadRequestException(
        `Ya existe una Maquina con valor duplicado para: ${error.meta?.target}`,
      );
    }
    if (error.code === 'P2025') {
      throw new NotFoundException(`Maquina con id "${_id}" no encontrado`);
    }
    console.error(error);
    throw new BadRequestException('Error al actualizar la Maquina');
  }
}


  // remove(id: number) {
  //   return `This action removes a #${id} maquina`;
  // }

async remove(id: string) {
  try {
    await this.prisma.maquina.delete({
      where: { id },
    });
    return { message: `Maquina con id ${id} eliminado` };
  } catch (error) {
    if (error.code === 'P2003') {
      throw new BadRequestException(
        'No se puede eliminar esta Maquina porque está siendo Utilizado.'
      );
    }
    if (error.code === 'P2025') {
      throw new BadRequestException(`MAquina con id "${id}" no encontrada`);
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

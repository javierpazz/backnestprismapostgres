import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Supplier } from '@prisma/client';

import { CreateProveedoreDto } from './dto/create-proveedore.dto';
import { UpdateProveedoreDto } from './dto/update-proveedore.dto';

@Injectable()
// export class ProveedoresService {

export class ProveedoresService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }


  // create(createProveedoreDto: CreateProveedoreDto) {
  //   return 'This action adds a new proveedor';
  // }


  async create(createProveedoreDto: CreateProveedoreDto, supplier:Supplier) {
    // createProveedorDto.nameCus = createProveedorDto.nameCus.toLocaleLowerCase();
    const { _id, ...rest } = createProveedoreDto;
    try {
      const supplier = await 
      this.supplier.create({data:rest});
      return supplier;
      
    } catch (error) {
      this.handleExceptions( error );
    }


  }




  async findAll() {
  // isAuth,
  // // isAdmin,

    const supplier = await this.supplier.findMany({
        orderBy: {
          name: 'asc',
        },
      })
      return supplier.map(c => ({
        _id: c.id,  // duplicamos el id en _id
        ...c,
      }));

  }

  async findOne(id: string) {
    
    let supplier: Supplier;
    if ( id ) {
      supplier = await this.supplier.findUnique({
      where: { id },
      });
    }

    if ( !supplier ) 
      throw new NotFoundException(`Supplier with id, name or no "${ id }" not found`);
    
    (supplier as any)._id = supplier.id;
    return supplier;
  }


async update(updateProveedoreDto: UpdateProveedoreDto) {
  const { _id, ...data } = updateProveedoreDto;



  try {
    const updated = await this.supplier.update({
      where: { id: _id }, // Prisma usa 'id'
      data,
    });

    // Devolver _id para compatibilidad con frontend
    return { _id: updated.id, ...updated };
  } catch (error) {
    // Unique constraint violation
    if (error.code === 'P2002') {
      throw new BadRequestException(
        `Ya existe un Proveedor con valor duplicado para: ${error.meta?.target}`,
      );
    }
    // Proveedor no encontrado
    if (error.code === 'P2025') {
      throw new NotFoundException(`Proveedor con id "${_id}" no encontrado`);
    }
    throw error;
  }
}


  // async remove(id: string) {

    // const invoices = await this.orderModel.findOne({id_client: id });
    // if (invoices) {
    //   throw new BadRequestException(`"No Puede Borrar el Cliente "${ id }"por que tiene Comprobantes con este cliente "`);
    //   return;
    // }
    

    // const { deletedCount } = await this.supplier.deleteOne({ _id: id });
    // if ( deletedCount === 0 )
    //   throw new BadRequestException(`Registro with id "${ id }" not found`);

    // return;

async remove(id: string) {
  try {
    await this.supplier.delete({
      where: { id },
    });
    return { message: `Proveedor con id ${id} eliminado` };
  } catch (error) {
    if (error.code === 'P2025') {
      throw new BadRequestException(`Proveedor con id "${id}" no encontrado`);
    }
    throw error; // otros errores
  }
}



  private handleExceptions( error: any ) {
    if ( error.code === 11000 ) {
      throw new BadRequestException(`Proveedor exists in db ${ JSON.stringify( error.keyValue ) }`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create Proveedor - Check server logs`);
  }


}

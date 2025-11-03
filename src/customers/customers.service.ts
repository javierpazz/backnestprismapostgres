import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, OnModuleInit } from '@nestjs/common';

import { PrismaClient, Customer } from '@prisma/client';

import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';


@Injectable()
// export class CustomersService {
export class CustomersService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }






  async create(createCustomerDto: CreateCustomerDto, customer:Customer) {
    // createCustomerDto.nameCus = createCustomerDto.nameCus.toLocaleLowerCase();
    const { _id, ...rest } = createCustomerDto;
    try {
      const customer = await 
      this.customer.create({data:rest});
      return customer;
      
    } catch (error) {
      this.handleExceptions( error );
    }


  }

  async findAll() {
  // isAuth,
  // // isAdmin,

    const customers = await this.customer.findMany({
        orderBy: {
          nameCus: 'asc',
        },
      })
      return customers.map(c => ({
        _id: c.id,  // duplicamos el id en _id
        ...c,
      }));

  }

  async findOne(id: string) {
    
    let customer: Customer;
    if ( id ) {
      customer = await this.customer.findUnique({
      where: { id },
      });
    }

    if ( !customer ) 
      throw new NotFoundException(`Customer with id, name or no "${ id }" not found`);
    
    (customer as any)._id = customer.id;
    return customer;
  }

async update(updateCustomerDto: UpdateCustomerDto) {
  const { _id, ...data } = updateCustomerDto;



  try {
    const updated = await this.customer.update({
      where: { id: _id }, // Prisma usa 'id'
      data,
    });

    // Devolver _id para compatibilidad con frontend
    return { _id: updated.id, ...updated };
  } catch (error) {
    // Unique constraint violation
    if (error.code === 'P2002') {
      throw new BadRequestException(
        `Ya existe un Customer con valor duplicado para: ${error.meta?.target}`,
      );
    }
    // Customer no encontrado
    if (error.code === 'P2025') {
      throw new NotFoundException(`Customer con id "${_id}" no encontrado`);
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
    

    // const { deletedCount } = await this.customer.deleteOne({ _id: id });
    // if ( deletedCount === 0 )
    //   throw new BadRequestException(`Registro with id "${ id }" not found`);

    // return;

async remove(id: string) {
  try {
    await this.customer.delete({
      where: { id },
    });
    return { message: `Customer con id ${id} eliminado` };
  } catch (error) {
    if (error.code === 'P2003') {
      throw new BadRequestException(
        'No se puede eliminar este Cliente porque está siendo Utilizado.'
      );
    }
    if (error.code === 'P2025') {
      throw new BadRequestException(`Cliente con id "${id}" no encontrado`);
    }
    throw error; // otros errores
  }
}

  private handleExceptions( error: any ) {
    if ( error.code === 11000 ) {
      throw new BadRequestException(`Customer exists in db ${ JSON.stringify( error.keyValue ) }`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create Customer - Check server logs`);
  }



}

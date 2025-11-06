import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common';
import { PrismaClient, Configuration } from '@prisma/client';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { ConfigService } from '@nestjs/config';



@Injectable()
export class ConfigurationsService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }





  async create(createconfigurationDto: CreateConfigurationDto, configuration:Configuration) {
    const { _id, ...rest } = createconfigurationDto;
    try {
      const configuration = await 
      this.configuration.create({data:rest});
      return configuration;
      
    } catch (error) {
      this.handleExceptions( error );
    }


  }


  async findAlladm() {
  const data = await this.configuration.findMany();
  const configuraciones = data.map(item => ({
      ...item,
      _id: item.id.toString(), // agregamos _id
    }));


  return configuraciones;
  }

  async findAll() {
  const data = await this.configuration.findMany();
  return {
    configurations: data.map(item => ({
      ...item,
      _id: item.id.toString(), // agregamos _id
    })),
  };
  }

  async findAllV() {
  const data = await this.configuration.findMany();
  const configurations = data.map(item => ({
    ...item,
    _id: item.id.toString(), // agregamos _id
  }));
  return configurations;
  }


  async findOne(id: string) {
    
    let configuration: Configuration;
    if ( id ) {
      configuration = await this.configuration.findUnique({
      where: { id },
      });
    }

    if ( !configuration ) 
      throw new NotFoundException(`Registro with id, name or no "${ id }" not found`);
    
    (configuration as any)._id = configuration.id;
    return configuration;
  }

async update(updateConfigurationDto: UpdateConfigurationDto) {
  const { _id, ...data } = updateConfigurationDto;



  try {
    const updated = await this.configuration.update({
      where: { id: _id }, // Prisma usa 'id'
      data,
    });

    // Devolver _id para compatibilidad con frontend
    return { _id: updated.id, ...updated };
  } catch (error) {
    // Unique constraint violation
    if (error.code === 'P2002') {
      throw new BadRequestException(
        `Ya existe un registro con valor duplicado para: ${error.meta?.target}`,
      );
    }
    // Registro no encontrado
    if (error.code === 'P2025') {
      throw new NotFoundException(`Registro con id "${_id}" no encontrado`);
    }
    throw error;
  }
}


async remove(id: string) {
  try {
    await this.configuration.delete({
      where: { id },
    });
    return { message: `P.Venta/Registro con id ${id} eliminado` };
  } catch (error) {
    if (error.code === 'P2003') {
      throw new BadRequestException(
        'No se puede eliminar este P.Venta/Registro porque está siendo Utilizado.'
      );
    }
    if (error.code === 'P2025') {
      throw new BadRequestException(`P.Venta/Registro con id "${id}" no encontrado`);
    }
    throw error; // otros errores
  }
}

  private handleExceptions( error: any ) {
    if ( error.code === 11000 ) {
      throw new BadRequestException(`Registro exists in db ${ JSON.stringify( error.keyValue ) }`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create Registro - Check server logs`);
  }


}

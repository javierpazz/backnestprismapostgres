import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';


@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }



  async create(createUserDto: CreateUserDto) {
    // createUserDto.nameCus = createUserDto.nameCus.toLocaleLowerCase();
    const { _id, ...rest } = createUserDto;
      const userInDB = await this.user.findUnique({
            where: { email : createUserDto.email },
            });
        if ( userInDB ) {
          throw new BadRequestException(
            `Ya existe un User con esos datos`,
          );
        }



    try {
      const user = await 
      this.user.create({
      data: {
          name: createUserDto.name,
          email: createUserDto.email,
          // password: createUserDto.password,
          password: bcrypt.hashSync(createUserDto.password, 10),
          isAdmin: createUserDto.isAdmin ?? false,
          isActive: createUserDto.isActive ?? true,
          role: createUserDto.role,
        },

      });
      return user;
      
    } catch (error) {
      this.handleExceptions( error );
    }


  }



  async findAll() {
  // isAuth,
  // // isAdmin,

    const users = await this.user.findMany({
        orderBy: {
          name: 'asc',
        },
      })
      return users.map(c => ({
        _id: c.id,  // duplicamos el id en _id
        ...c,
      }));

  }

  async findOne(id: string) {
    
    let user: User;
    if ( id ) {
      user = await this.user.findUnique({
      where: { id },
      });
    }

    if ( !user ) 
      throw new NotFoundException(`User with id, name or no "${ id }" not found`);
    
    (user as any)._id = user.id;
    return user;
  }

async update(updateUserDto: UpdateUserDto) {
  const { _id, ...data } = updateUserDto;

  try {

////////
  const user = await this.findOne(updateUserDto._id);
        const validPassword = bcrypt.compareSync( updateUserDto.password, user.password );
        ///// verifico pasword y si es admin puede nodificar sin password
        if ( !validPassword && updateUserDto.puede === false ) {
          throw new UnauthorizedException('Password incorrecto');
        }
        ///// verifico pasword
        // user.name = updateUserDto.name;
        // user.email = updateUserDto.email;
        if (updateUserDto.passwordNue !== "") {
        user.password = bcrypt.hashSync(updateUserDto.passwordNue, 10);
        }
////////



    const updated = await this.user.update({
      where: { id: _id }, // Prisma usa 'id'
            data: {
          name: updateUserDto.name,
          email: updateUserDto.email,
          password: user.password,
          isAdmin: updateUserDto.isAdmin ?? false,
          isActive: updateUserDto.isActive ?? true,
          role: updateUserDto.role,
        },

    });

    // Devolver _id para compatibilidad con frontend
    return { _id: updated.id, ...updated };
  } catch (error) {
    // Unique constraint violation
    if (error.code === 'P2002') {
      throw new BadRequestException(
        `Ya existe un User con valor duplicado para: ${error.meta?.target}`,
      );
    }
    // User no encontrado
    if (error.code === 'P2025') {
      throw new NotFoundException(`User con id "${_id}" no encontrado`);
    }
    throw error;
  }
}

async updateRole(updateUserDto: UpdateUserDto) {
  const { userId, ...data } = updateUserDto;
  try {
    const updated = await this.user.update({
      where: { id: userId }, // Prisma usa 'id'
            data: {
          role: updateUserDto.role,
        },
    });

    // Devolver _id para compatibilidad con frontend
    return { _id: updated.id, ...updated };
  } catch (error) {
    throw error;
  }
}
async updateisActive(updateUserDto: UpdateUserDto) {
  const { userId, ...data } = updateUserDto;
  try {
    const updated = await this.user.update({
      where: { id: userId }, // Prisma usa 'id'
            data: {
          isActive: updateUserDto.isActive,
        },
    });

    // Devolver _id para compatibilidad con frontend
    return { _id: updated.id, ...updated };
  } catch (error) {
    throw error;
  }
}

async remove(id: string) {
  try {
    await this.user.delete({
      where: { id },
    });
    return { message: `User con id ${id} eliminado` };
  } catch (error) {
    if (error.code === 'P2003') {
      throw new BadRequestException(
        'No se puede eliminar este Usuario porque está siendo Utilizado.'
      );
    }
    if (error.code === 'P2025') {
      throw new BadRequestException(`User con id "${id}" no encontrado`);
    }
    throw error; // otros errores
  }
}

  private handleExceptions( error: any ) {
    if ( error.code === 11000 ) {
      throw new BadRequestException(`User exists in db ${ JSON.stringify( error.keyValue ) }`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create User - Check server logs`);
  }


}

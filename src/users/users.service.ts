import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import mg from 'mailgun-js';
import * as mg from 'mailgun-js';

import { PrismaClient, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';


// import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtPayload } from 'src/auth/interfaces';

@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }


  constructor(
    private readonly jwtService: JwtService,
    // private readonly customersService: CustomersService,    
  ) {super()}


  async forget(createUserDto: CreateUserDto) {

// const mailgun = () =>
//     mg({
//       apiKey: process.env.MAILGUN_API_KEY,
//       domain: process.env.MAILGUN_DOMIAN,
//     });

const mailgun = mg({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
  // host: 'api.eu.mailgun.net', // 👈 IMPORTANTE si es región EU
});

    const baseUrl = () =>
      process.env.BASE_URL
        ? process.env.BASE_URL
        : process.env.NODE_ENV !== 'production'
        // ? 'http://localhost:3000'
        ? 'http://localhost:5173'
        : 'https://yourdomain.com';

    const { _id, ...rest } = createUserDto;

    try {
      const userInDB = await this.user.findUnique({
        where: { email : createUserDto.email },
      });
      if ( userInDB ) {
      // const token = jwt.sign({ _id: userInDB._id }, process.env.JWT_SECRET, {
      //   expiresIn: '3h',
      // });
      const token = this.getJwtToken({ _id: userInDB.id })

      //////// modifica resetToken
        const user = await this.findOne(userInDB.id);

        const updated = await this.user.update({
          where: { id: userInDB.id }, // Prisma usa 'id'
          data: {
            resetToken : token,
          },
          
        });

      //   // Devolver _id para compatibilidad con frontend
      //   return { _id: updated.id, ...updated };
      // //////// modifica resetToken



      //reset link


        await mailgun
        .messages()
        .send(
          {
            from: 'JPZ <javier_pazz@hotmail.com>',
            to: `${userInDB.name} <${userInDB.email}>`,
            subject: `Reset Password`,
            html: ` 
             <p>Please Click the following link to reset your password:</p> 
             <a href="${baseUrl()}/reset-password/${token}/"}>Reset Password</a>
             `,
          },
          (error, body) => {
            console.log(error);
            console.log(body);
          }
        );
      // res.send({ message: 'Enviamos un link para actualizar su password' });
    // } else {
    //   res.status(404).send({ message: 'Usuario no encontrado' });
    }else{
            throw new BadRequestException(
        `No existe un Usuario con esos datos`,
      );

    }

    } catch (error) {
      this.handleExceptions( error );
    }


  }

/////////resetpasword
  async reset(createUserDto: any) {

    // jwt.verify(createUserDto.resetToken, process.env.JWT_SECRET, async (err, decode) => {
      // if (err) {
      //   res.status(401).send({ message: 'Invalid Token' });
      // } else {
        // const user = await User.findOne({ resetToken: req.body.token });
        // if (user) {
        //   if (req.body.password) {
        //     user.password = bcrypt.hashSync(req.body.password, 8);
        //     await user.save();
        //     res.send({
        //       message: 'Password reseted successfully',
        //     });
        //   }
        // } else {
        //   res.status(404).send({ message: 'User not found' });
        // }
      try {
          const userInDB = await this.user.findFirst({
            where: { resetToken : createUserDto.token},
            // where: { email : createUserDto.email },
          });
            if ( userInDB ) {

      //////// modifica password
              const user = await this.findOne(userInDB.id);

                const updated = await this.user.update({
                  where: { id: userInDB.id }, // Prisma usa 'id'
                  data: {
                    password: bcrypt.hashSync(createUserDto.password, 10),
                  },
                });
              } else {
                      throw new BadRequestException(
                  `No existe un Usuario con esos datos`,
                );
              }
        } catch (error) {
          this.handleExceptions( error );
        }
      
    // });
  }


/////////resetpasword

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
          resetToken : "",
          name: createUserDto.name,
          email: createUserDto.email,
          // password: createUserDto.password,
          password: bcrypt.hashSync(createUserDto.passwordNue, 10),
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

async updatePerfil(updateUserDto: UpdateUserDto) {
  const { _id, ...data } = updateUserDto;

  try {

////////
  const user = await this.findOne(updateUserDto._id);
        const validPassword = bcrypt.compareSync( updateUserDto.password, user.password );
        // if ( !validPassword || updateUserDto.puede === false ) {
        if ( !validPassword ) {
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

  private getJwtToken( payload: JwtPayload ) {

      const token = this.jwtService.sign( payload );
      return token;

    }


}

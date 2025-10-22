import { BadRequestException, Injectable, InternalServerErrorException, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { PrismaClient, User } from '@prisma/client';
// import { User } from './entities/user.entity';
import { LoginUserDto, CreateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';


@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  constructor(
    private readonly jwtService: JwtService,
    
  ) {super()}


  async create( createUserDto: CreateUserDto, user:User) {
    
    try {
      const { password, ...userData } = createUserDto;
          user = await this.user.create({
            data: {
              ...userData,
              password: bcrypt.hashSync( password, 10 )
                },
          })


      delete user.password;

      return {
        ...user,
        _id: user.id.toString(), // agregamos _id
        token: this.getJwtToken({ _id: user.id })
      };
      // TODO: Retornar el JWT de acceso

    } catch (error) {
      this.handleDBErrors(error);
    }

  }

  async loginadm( loginUserDto: LoginUserDto ) {

    const { password, email } = loginUserDto;
    

    const user = await this.user.findUnique({
      where: { email },
      // select: { email: true, password: true, id: true } //! OJO!
    });

    if ( !user ) 
      throw new UnauthorizedException('Credentials are not valid (email)');
      
    if ( !bcrypt.compareSync( password, user.password ) )
      throw new UnauthorizedException('Credentials are not valid (password)');

    if ( !user.isActive || user.role === "client" ) {
      throw new UnauthorizedException('Credentials are not valid (Client)');
    }

    // // Regresar el usuario sin el password
    // const { password: _, ...rest } = user;
    // // console.log(user);
    // return rest;
    const {role, roles, name, id, isAdmin, isActive} = user;
    
    return {
      // ...user,
            user: {_id: id,
                email,
                roles,
                role,
                isAdmin,
                isActive,
                name
             },
      token: this.getJwtToken({ _id: user.id })
    };
  }

  async checkAuthStatus( user: User ){

    const {role, roles, name, id, email, isAdmin, isActive} = user;

    return {
      // ...user,
                  user: {_id: id,
                email,
                roles,
                role,
                isAdmin,
                isActive,
                name
             },
      token: this.getJwtToken({ _id: user.id })
    };

  }


// async findOneByEmail(email: string) {
//   try {
//     console.log("user");

//     const user = await this.user.findFirst({
//       where: { email }
//     });
    
//     if ( !user ) return null;


//     return user;


//   } catch (error) {
//     console.log(error);
//     return null;
//   }  }



  async findOneValidate( id: string ) {

    // const { password, email } = loginUserDto;

    const user = await this.user.findUnique({
      where: { id },
      // select: { email: true, password: true, id: true } //! OJO!
    });

    return {
      ...user,
      _id: user.id.toString(), // agregamos _id
      token: this.getJwtToken({ _id: user.id })
    };
  }



  
  private getJwtToken( payload: JwtPayload ) {

    const token = this.jwtService.sign( payload );
    return token;

  }

  private handleDBErrors( error: any ): never {


    if ( error.code === 'P2002' ) 
      throw new BadRequestException( error.detail );

    console.log(error)

    throw new InternalServerErrorException('Please check server logs');

  }


}

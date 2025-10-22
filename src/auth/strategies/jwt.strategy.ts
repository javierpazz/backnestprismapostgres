import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
// import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
// import { Repository } from 'typeorm';
// import { User } from '../entities/user.entity';
import { User } from '@prisma/client';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {

    constructor(
        private readonly authService: AuthService,
        configService: ConfigService
    ) {

        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }


    async validate( payload: JwtPayload ): Promise<User> {
        
        const { _id } = payload;

        const user = await this.authService.findOneValidate( _id );

        if ( !user ) 
            throw new UnauthorizedException('Token not valid')
            
        // if ( !user.isActive ) 
        //     throw new UnauthorizedException('User is inactive, talk with an admin');

        return user;
    }

}
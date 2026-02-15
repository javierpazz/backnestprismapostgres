import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('users/forget-password')
  // @Auth( ValidRoles.admin )
  forget(@Body() createUserDto: any) {
    return this.usersService.forget(createUserDto);
  }
  @Post('users/reset-password')
  @Auth()
  reset(@Body() createUserDto: any) {
    return this.usersService.reset(createUserDto);
  }

  @Post('tes/admin/users')
  @Auth( ValidRoles.admin )
  create(@Body() createUserDto: any) {
    return this.usersService.create(createUserDto);
  }

  @Get('tes/admin/users')
  @Auth()
  findAll() {
    return this.usersService.findAll();
  }
  
  
  @Get('tes/admin/users/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
  
  @Put('tes/admin/users')
  @Auth( ValidRoles.admin )
  update(@Body() updateUserDto: any) {
    return this.usersService.update(updateUserDto);
  }

  @Put('tes/admin/users/perfil')
  @Auth()
  updatePerfil(@Body() updateUserDto: any) {
    return this.usersService.updatePerfil(updateUserDto);
  }

  @Put('tes/admin/users/role')
  @Auth( ValidRoles.admin )
  updateRole(@Body() updateUserDto: any) {
    return this.usersService.updateRole(updateUserDto);
  }
  @Put('tes/admin/users/isActive')
  @Auth( ValidRoles.admin )
  updateisActive(@Body() updateUserDto: UpdateUserDto) {
    console.log(updateUserDto)
    return this.usersService.updateisActive(updateUserDto);
  }

  @Delete('tes/admin/users/:id')
  @Auth( ValidRoles.admin )
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}

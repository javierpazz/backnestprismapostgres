import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('tes/admin/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Auth( ValidRoles.admin )
  create(@Body() createUserDto: any) {
    console.log(createUserDto)
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Auth()
  findAll() {
    return this.usersService.findAll();
  }
  
  
  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
  
  @Put()
  @Auth( ValidRoles.admin )
  update(@Body() updateUserDto: any) {
    return this.usersService.update(updateUserDto);
  }
  @Put('role')
  @Auth( ValidRoles.admin )
  updateRole(@Body() updateUserDto: any) {
    return this.usersService.updateRole(updateUserDto);
  }
  @Put('isActive')
  @Auth( ValidRoles.admin )
  updateisActive(@Body() updateUserDto: UpdateUserDto) {
    console.log(updateUserDto)
    return this.usersService.updateisActive(updateUserDto);
  }

  @Delete('/:id')
  @Auth( ValidRoles.admin )
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}

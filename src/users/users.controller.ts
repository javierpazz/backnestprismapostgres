import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('tes/admin/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: any) {
    console.log(createUserDto)
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }


  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put()
  update(@Body() updateUserDto: any) {
    return this.usersService.update(updateUserDto);
  }
  @Put('role')
  updateRole(@Body() updateUserDto: any) {
    return this.usersService.updateRole(updateUserDto);
  }
  @Put('isActive')
  updateisActive(@Body() updateUserDto: UpdateUserDto) {
    console.log(updateUserDto)
    return this.usersService.updateisActive(updateUserDto);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}

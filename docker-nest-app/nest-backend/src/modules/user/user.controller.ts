import { Body, Controller, Delete, Get, Patch, Req } from '@nestjs/common';
import type { Request } from 'express';
import { UserService } from './user.service';
import { userData } from '../../common/utils/types';
import { UpdateUserRoleDto } from './dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Get()
  async getUsers(@Req() request: Request) {
    const user = request['user'] as userData;
    return this._userService.getAllUsers(user);
  }

  @Delete(':id')
  async deleteUser(@Req() request: Request) {
    const user = request['user'] as userData;
    if (user.role !== 'admin') {
      throw new Error('Unauthorized');
    }
    return this._userService.deleteUser(request.params.id as string);
  }

  @Patch('/updateRole')
  async updateUserRole(
    @Req() request: Request,
    @Body() payload: UpdateUserRoleDto,
  ) {
    const user = request['user'] as userData;
    if (user.role !== 'admin') {
      throw new Error('Unauthorized');
    }
    return this._userService.updateUserRole(payload.userId);
  }
}

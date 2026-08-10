import { Controller, Get, Req } from '@nestjs/common';
import type { Request } from 'express';
import { userData } from 'src/common/types';
import { UserService } from 'src/services/user/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Get()
  async getUsers(@Req() request: Request) {
    const user = request['user'] as userData;
    return this._userService.getAllUsers(user);
  }
}

import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { Public } from 'src/common/decorators/public-decorator';
import { userData } from 'src/common/types';
import { LoginDto, RegisterDto } from 'src/dto/auth.dto';
import { AuthService } from 'src/services/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Get('users')
  async getUsers(@Req() request: Request) {
    const user = request['user'] as userData;
    return this._authService.getAllUsers(user);
  }

  @Public()
  @Post('login')
  async login(@Body() payload: LoginDto) {
    return this._authService.authenticateUser(payload);
  }

  @Public()
  @Post('register')
  async register(@Body() payload: RegisterDto) {
    return this._authService.saveUser(payload);
  }
}

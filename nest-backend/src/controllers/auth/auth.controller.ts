import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { Public } from 'src/common/decorators/public-decorator';
import { userData } from 'src/common/types';
import { LoginDto, RegisterDto } from 'src/dto/auth.dto';
import { AuthService } from 'src/services/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private _authService: AuthService) {}

  @Get('users')
  async getUsers(@Req() request: Request, @Res() response: Response) {
    const user = request['user'] as userData;
    const result = await this._authService.getAllUsers(user);
    return response.status(result.status).json(result);
  }

  @Public()
  @Post('login')
  async login(@Body() payload: LoginDto, @Res() response: Response) {
    const result = await this._authService.authenticateUser(payload);
    return response.status(result.status).json(result);
  }

  @Public()
  @Post('register')
  async register(@Body() payload: RegisterDto, @Res() response: Response) {
    const result = await this._authService.saveUser(payload);
    return response.status(result.status).json(result);
  }
}

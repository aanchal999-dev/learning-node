import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '../../common/decorators/public-decorator';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

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

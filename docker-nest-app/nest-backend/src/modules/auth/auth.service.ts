import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly _configService: ConfigService,
    private readonly _jwtService: JwtService,
  ) { }

  // 1. Register User in MySQL Database
  async saveUser(payload: RegisterDto): Promise<{ message: string }> {
    const userExists = await this.userRepository.findOne({
      where: { username: payload.username },
    });

    if (userExists) {
      throw new ConflictException('Username already exists!');
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const role =
      payload.username === this._configService.getOrThrow('ADMIN_USERNAME')
        ? 'admin'
        : 'user';

    const newUser = this.userRepository.create({
      ...payload,
      password: hashedPassword,
      role,
    });

    await this.userRepository.save(newUser);

    return { message: 'User registered successfully' };
  }

  // 2. Authenticate / Login User from MySQL Database
  async authenticateUser(
    payload: LoginDto,
  ): Promise<{ token: string; role: string; message: string }> {
    let role: string;
    let usernameToSign: string;

    if (
      payload.username ===
      this._configService.getOrThrow<string>('ADMIN_USERNAME')
    ) {
      const adminPassword =
        this._configService.getOrThrow<string>('ADMIN_PASSWORD');
      if (payload.password !== adminPassword) {
        throw new UnauthorizedException('Invalid credentials!');
      }
      usernameToSign = payload.username;
      role = 'admin';
    } else {
      const foundUser = await this.userRepository.findOne({
        where: { username: payload.username },
      });

      if (!foundUser) {
        throw new NotFoundException('User not found!');
      }

      const isPasswordValid = await bcrypt.compare(
        payload.password,
        foundUser.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials!');
      }
      usernameToSign = foundUser.username;
      role = foundUser.role || 'user';
    }

    const token = await this._jwtService.signAsync({
      username: usernameToSign,
      role,
    });

    return {
      message: 'Login successful',
      token,
      role,
    };
  }
}

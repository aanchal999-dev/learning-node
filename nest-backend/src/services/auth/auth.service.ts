import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { StoredUser } from '../../common/types';
import { readUsers, writeUsers } from '../../common/utils/storage.util';
import { LoginDto, RegisterDto } from '../../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly _jwtService: JwtService) {}

  async saveUser(payload: RegisterDto): Promise<{ message: string }> {
    const users = await readUsers();
    const userExists = users.some((user) => user.username === payload.username);

    if (userExists) {
      throw new ConflictException('Username already exists!');
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const role = payload.username === 'admin@login.com' ? 'admin' : 'user';

    const newUser: StoredUser = {
      ...payload,
      password: hashedPassword,
      role,
    };

    users.push(newUser);
    await writeUsers(users);

    return { message: 'User registered successfully' };
  }

  async authenticateUser(
    payload: LoginDto,
  ): Promise<{ token: string; role: string; message: string }> {
    const users = await readUsers();
    const foundUser = users.find((u) => u.username === payload.username);

    if (!foundUser) {
      throw new NotFoundException('User not found!');
    }

    let isPasswordValid = await bcrypt.compare(payload.password, foundUser.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    const role = foundUser.role || (foundUser.username === 'admin@login.com' ? 'admin' : 'user');

    const token = await this._jwtService.signAsync({
      username: foundUser.username,
      role,
    });

    return {
      message: 'Login successful',
      token,
      role,
    };
  }
}

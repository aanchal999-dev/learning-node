import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs/promises';
import * as path from 'path';
import { userData } from 'src/common/types';
import { LoginDto, RegisterDto } from 'src/dto/auth.dto';

export interface StoredUser extends RegisterDto {
  role?: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly filePath = path.join(process.cwd(), 'storage', 'data.json');

  constructor(private readonly _jwtService: JwtService) {}

  private async readUsers(): Promise<StoredUser[]> {
    try {
      const fileData = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(fileData) as StoredUser[];
    } catch (error) {
      this.logger.error('Error reading data file', error);
      throw new InternalServerErrorException('Error reading storage data');
    }
  }

  private async writeUsers(users: StoredUser[]): Promise<void> {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(users, null, 2), 'utf8');
    } catch (error) {
      this.logger.error('Error writing data file', error);
      throw new InternalServerErrorException('Error saving user data');
    }
  }

  async saveUser(payload: RegisterDto): Promise<{ message: string }> {
    const users = await this.readUsers();
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
    await this.writeUsers(users);

    return { message: 'User registered successfully' };
  }

  async authenticateUser(
    payload: LoginDto,
  ): Promise<{ token: string; role: string; message: string }> {
    const users = await this.readUsers();
    const foundUser = users.find((u) => u.username === payload.username);

    if (!foundUser) {
      throw new NotFoundException('User not found!');
    }

    // Support bcrypt hashed passwords with fallback to plain text for legacy testing data
    let isPasswordValid = await bcrypt.compare(payload.password, foundUser.password);
    if (!isPasswordValid && payload.password === foundUser.password) {
      isPasswordValid = true;
    }

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

  async getAllUsers(userDetails: userData): Promise<StoredUser[]> {
    const users = await this.readUsers();
    const currentUser = users.find((u) => u.username === userDetails.username);

    const isAdmin =
      currentUser?.role === 'admin' || userDetails.username === 'admin@login.com';

    if (isAdmin) {
      return users;
    }

    if (currentUser) {
      return [currentUser];
    }

    throw new NotFoundException('User not found!');
  }
}

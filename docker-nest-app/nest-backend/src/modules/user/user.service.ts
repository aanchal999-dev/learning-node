import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { StoredUser, userData } from '../../common/utils/types';

export type UserResponse = Omit<StoredUser, 'password'>;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly _configService: ConfigService,
  ) { }

  // fetches data of all the users to display for admin
  async getAllUsers(userDetails: userData): Promise<UserResponse[]> {
    const users = await this.userRepository.find();
    const currentUser = users.find((u) => u.username === userDetails.username);

    const isAdmin =
      currentUser?.role === 'admin' ||
      userDetails.username ===
        this._configService.getOrThrow<string>('ADMIN_USERNAME');

    const sanitizeUser = (user: StoredUser): UserResponse => {
      const { password, ...rest } = user;
      return rest;
    };

    if (isAdmin) {
      return users.map(sanitizeUser);
    }

    if (currentUser) {
      return [sanitizeUser(currentUser)];
    }

    throw new NotFoundException('User not found!');
  }

  async deleteUser(
    userId: string,
  ): Promise<{ message: string; isDone: number }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found!');
    }
    await this.userRepository.remove(user);
    return { message: 'User deleted successfully', isDone: 1 };
  }

  async updateUserRole(
    userId: string,
  ): Promise<{ message: string; isDone: number }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    user.role = user.role === 'admin' ? 'user' : 'admin';
    await this.userRepository.save(user);
    return { message: 'User role updated successfully', isDone: 1 };
  }
}

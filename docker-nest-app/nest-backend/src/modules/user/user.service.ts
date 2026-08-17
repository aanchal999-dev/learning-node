import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { StoredUser, userData } from '../../common/utils/types';

export type UserResponse = Omit<StoredUser, 'password'>;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  // fetches data of all the users to display for admin
  async getAllUsers(userDetails: userData): Promise<UserResponse[]> {
    const isAdmin = userDetails.role === 'admin';

    const sanitizeUser = (user: StoredUser): UserResponse => {
      const { password, ...rest } = user;
      return rest;
    };

    if (isAdmin) {
      const users = await this.userRepository.find({
        where: {
          username: Not(userDetails.username),
        },
      });
      return users.map(sanitizeUser);
    }

    const currentUser = await this.userRepository.findOne({
      where: { username: userDetails.username },
    });

    if (!currentUser) {
      throw new NotFoundException('User not found!');
    }

    return [sanitizeUser(currentUser)];
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

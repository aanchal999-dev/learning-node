import { Injectable, NotFoundException } from '@nestjs/common';
import { StoredUser, userData } from 'src/common/types';
import { readUsers } from 'src/common/utils/storage.util';

export type UserResponse = Omit<StoredUser, 'password'>;

@Injectable()
export class UserService {
  async getAllUsers(userDetails: userData): Promise<UserResponse[]> {
    const users = await readUsers();
    const currentUser = users.find((u) => u.username === userDetails.username);

    const isAdmin =
      currentUser?.role === 'admin' || userDetails.username === 'admin@login.com';

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
}


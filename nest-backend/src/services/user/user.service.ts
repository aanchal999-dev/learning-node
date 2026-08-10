import { Injectable, NotFoundException } from '@nestjs/common';
import { StoredUser, userData } from 'src/common/types';
import { readUsers } from 'src/common/utils/storage.util';

@Injectable()
export class UserService {
  async getAllUsers(userDetails: userData): Promise<StoredUser[]> {
    const users = await readUsers();
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

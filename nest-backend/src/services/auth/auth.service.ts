import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from 'src/dto/auth.dto';
import fs from 'fs';
import { resData, userData } from 'src/common/types';

@Injectable()
export class AuthService {
  constructor(private _jwtService: JwtService) {}

  async saveUser(payload: RegisterDto): Promise<resData> {
    let status = 201;
    let message = '';
    let isSuccess = false;
    const fileData = await fs.promises.readFile('./storage/data.json', 'utf8');
    const userdata = (await JSON.parse(fileData)) as RegisterDto[];
    const userExists = userdata.some((obj) => {
      return obj.username === payload.username;
    });
    if (!userExists) {
      userdata.push(payload);
      try {
        await fs.promises.writeFile(
          './storage/data.json',
          JSON.stringify(userdata, null, 1),
          'utf8',
        );
        message = 'User data saved';
        isSuccess = true;
        console.log('User data saved');
      } catch (error) {
        status = 500;
        message = 'Error parsing JSON';
        console.error('Error parsing JSON:', error);
      }
    } else {
      status = 422;
      message = 'Username already exists!';
    }
    return { message, isSuccess, status };
  }

  private findUser(
    userArray: RegisterDto[],
    username: string,
  ): RegisterDto | undefined {
    const foundUser = userArray.find(
      (user: RegisterDto) => user.username === username,
    );
    return foundUser;
  }

  async authenticateUser(payload: LoginDto): Promise<resData> {
    let status = 200;
    let message: string = '';
    let isSuccess = false;
    let userArray: RegisterDto[];
    let data: { token: string; role: string } | null = null;
    try {
      const isAdmin = payload.username.includes('admin');
      const role = isAdmin ? 'admin' : 'user';
      const userData = await fs.promises.readFile(
        './storage/data.json',
        'utf8',
      );
      userArray = (await JSON.parse(userData)) as RegisterDto[];
      if (
        isAdmin &&
        (payload.username !== 'admin@login.com' ||
          payload.password !== 'adminpass')
      ) {
        status = 401;
        message = 'Unauthorised access';
      } else if (!isAdmin) {
        const foundUser = this.findUser(userArray, payload.username);
        if (foundUser) {
          if (foundUser.password !== payload.password) {
            status = 500;
            message = 'password incorrect!';
          }
        } else {
          status = 404;
          message = 'User not found!';
        }
      }
      if (status === 200) {
        const token = await this._jwtService.signAsync({
          username: payload.username,
          role,
        });
        message = 'login successful';
        isSuccess = true;
        data = { token, role };
      }
    } catch (error) {
      status = 500;
      message = 'Error reading file';
      console.error('Error reading file', error);
    }
    return { isSuccess, data, message, status };
  }

  async getAllUsers(userDetails: userData): Promise<resData> {
    const isAdmin = userDetails.username.includes('admin');
    let status = 200;
    let message = '';
    let isSuccess = false;
    let data: RegisterDto[] = [];
    try {
      const userData = await fs.promises.readFile(
        './storage/data.json',
        'utf8',
      );
      const userArray = (await JSON.parse(userData)) as RegisterDto[];
      const foundUser = this.findUser(userArray, userDetails.username);
      if (!isAdmin && !foundUser) {
        status = 404;
        message = 'User not found!';
      } else if (isAdmin) {
        data = userArray;
        message = 'Users fetched for admin';
        isSuccess = true;
      } else if (foundUser) {
        data = [foundUser];
        message = 'Users fetched for user';
        isSuccess = true;
      }
    } catch (error) {
      status = 500;
      message = 'Error reading file';
      console.error('Error reading file', error);
    }
    return { status, data, message, isSuccess };
  }
}

import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  designation: string;

  @IsNotEmpty()
  @IsEmail()
  username: string;

  @MinLength(6)
  password: string;
}

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  username: string;

  @MinLength(6)
  password: string;
}

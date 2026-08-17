import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  designation!: string;

  @IsNotEmpty()
  @IsEmail()
  username!: string;

  @MinLength(6)
  @IsString()
  password!: string;
}

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  username!: string;

  @MinLength(6)
  @IsString()
  password!: string;
}

import { RegisterDto } from 'src/dto/auth.dto';

export type userData = {
  token: string;
  username: string;
};

export interface StoredUser extends RegisterDto {
  role?: string;
}

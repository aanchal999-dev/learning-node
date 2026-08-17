import { RegisterDto } from '../../modules/auth/dto/auth.dto';

export type userData = {
  token: string;
  username: string;
  role: string;
};

export interface StoredUser extends RegisterDto {
  id?: string;
  role?: string;
}


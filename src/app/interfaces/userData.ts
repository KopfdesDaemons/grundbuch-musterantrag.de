import { User } from 'server/models/user.model';

export interface UserData {
  page: number;
  totalPages: number;
  totalUsers: number;
  files: User[];
}

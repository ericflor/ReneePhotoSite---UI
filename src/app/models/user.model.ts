import { Photo } from './photo.model';

export interface User {
  id?: number;
  username: string;
  password?: string;
  role: UserRole;
  photos?: Photo[];
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

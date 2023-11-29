import { Photo } from './photo.model';

export interface User {
  id?: number;
  username: string;
  password?: string; // Include or exclude based on your use case
  role: UserRole;
  photos?: Photo[];
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

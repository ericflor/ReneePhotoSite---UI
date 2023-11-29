export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface UserRegistrationDto {
  id?: number;
  username: string;
  password: string;
  role: UserRole;
}

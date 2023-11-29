import { User } from './user.model';

export interface Photo {
  id?: number;
  title: string;
  date?: string;
  description: string;
  location: string;
  photo?: any;
  user?: User;
}

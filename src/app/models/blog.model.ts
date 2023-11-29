import { Photo } from './photo.model';

export interface Blog {
  id?: number;
  title: string;
  body: string;
  date?: Date;
  photos: Photo[];
}

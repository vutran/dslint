import { Model } from './model';

export interface IUser {
  id: string;
  handle: string;
  img_url: string;
  email: string;
}

export class User extends Model<IUser> {}

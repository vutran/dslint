import { Model } from './model';
import { User } from './user';

export type StyleType = 'FILL' | 'TEXT' | 'EFFECT' | 'GRID';

export interface IStyle {
  key: string;
  file_key: string;
  node_id: string;
  style_type: StyleType;
  thumbnail_url: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  user: User;
  sort_position: string;
}

export class Style extends Model<IStyle> {}

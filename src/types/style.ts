import { User } from './user';

export type StyleType = 'FILL' | 'TEXT' | 'EFFECT' | 'GRID';

export class Style {
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

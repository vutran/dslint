import { Model } from './model';

export type NodeType =
  | 'DOCUMENT'
  | 'CANVAS'
  | 'FRAME'
  | 'GROUP'
  | 'VECTOR'
  | 'BOOLEAN_OPERATION'
  | 'STAR'
  | 'LINE'
  | 'ELLIPSE'
  | 'REGULAR_POLYGON'
  | 'RECTANGLE'
  | 'TEXT'
  | 'SLICE'
  | 'COMPONENT'
  | 'INSTANCE';

export interface INode {
  id: string;
  name: string;
  visible: string;
  type: NodeType;
}

export class Node<T> extends Model<T & INode> {
  constructor(data: AnyType) {
    super(data);
    if (data.children) {
      const children = data.children.map((child: AnyType) => new Node(child));
      (this.data as any).children = children;
    }
  }
}

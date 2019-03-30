import { Model } from './model';
import { Canvas } from './canvas';

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
      const children = data.children.map((child: AnyType) =>
        Node.createByType(child.type, child)
      );
      (this.data as any).children = children;
    }
  }

  static createByType<U>(nodeType: NodeType, data: U) {
    switch (nodeType) {
      case 'CANVAS':
        return new Canvas(data);
      default:
        return new Node(data);
    }
  }
}

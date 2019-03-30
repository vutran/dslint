import { Node } from './node';

export interface ICanvas {
  backgroundColor: AnyType;
  prototypeStartNodeID: string;
  exportSettings: AnyType[];
}

export class Canvas extends Node<ICanvas> {}

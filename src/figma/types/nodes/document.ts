import { Node } from '../node';

export interface IDocument {
  children: AnyType[];
}

export class Document extends Node<IDocument> {}

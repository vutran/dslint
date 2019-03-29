export interface NodeConstructor {
  new (): INode;
}

export interface INode {
  data: Object;
}

export class AbstractNode implements INode {
  data: Object;

  constructor(nodeData: Object) {
    this.data = nodeData;
  }
}

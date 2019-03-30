export interface AbstractNodeConstructor {
  new (): AbstractNode;
}

export class AbstractNode {
  data: Object;

  constructor(nodeData: Object) {
    this.data = nodeData;
  }
}

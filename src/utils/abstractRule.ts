export interface RuleFailure {
  ruleName: string;
  message: string;
  node: any;
}

export interface RuleMetadata {
  ruleName: string;
}

export interface RuleConstructor {
  new (metadata: RuleMetadata, node: any): AbstractRule;
}

export type RuleNameAndConstructor = [string, RuleConstructor];

export abstract class AbstractRule {
  metadata: RuleMetadata;
  node: any;

  constructor(metadata: RuleMetadata, node: any) {
    this.metadata = metadata;
    this.node = node;
  }

  getRuleName() {
    return this.metadata.ruleName;
  }

  getNode() {
    return this.node;
  }

  apply(): RuleFailure[] {
    return [];
  }
}

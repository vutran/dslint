export interface RuleFailure {
  ruleName: string;
  message: string;
  node: AnyType;
}

export interface RuleMetadata {
  ruleName: string;
}

export interface RuleConstructor {
  new (metadata: RuleMetadata, node: AnyType): AbstractRule;
}

export type RuleNameAndConstructor = [string, RuleConstructor];

export abstract class AbstractRule {
  metadata: RuleMetadata;
  node: AnyType;

  constructor(metadata: RuleMetadata, node: AnyType) {
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

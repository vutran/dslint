export interface RuleFailure {
  ruleName: string;
  message: string;
  node: any;
}

export interface RuleMetadata {
  ruleName: string;
}

export interface RuleConstructor {
  new (metadata: RuleMetadata, node: any): IRule;
}

export type RuleNameAndConstructor = [string, RuleConstructor];

export interface IRule {
  /**
   * Entry point for each point.
   */
  apply: () => RuleFailure[];
}

export abstract class AbstractRule implements IRule {
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

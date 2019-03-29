import * as Figma from 'figma-js';

export interface RuleFailure {
  ruleName: string;
  message: string;
  node: Figma.Node;
}

export interface RuleMetadata {
  ruleName: string;
}

export interface RuleConstructor {
  new (metadata: RuleMetadata, node: Figma.Node): IRule;
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
  node: Figma.Node;

  constructor(metadata: RuleMetadata, node: Figma.Node) {
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

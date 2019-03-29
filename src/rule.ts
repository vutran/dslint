import * as Figma from 'figma-js';

export interface RuleConstructor {
  new (): IRule;
}

export interface RuleFailure {
  ruleName: string;
  message: string;
  node: Figma.Node;
}

export interface IRule {
  /**
   * Entry point for each point.
   */
  apply: (node: Figma.Node) => RuleFailure[];
}

export abstract class AbstractRule implements IRule {
  constructor() {}
  apply(node: Figma.Node): RuleFailure[] {
    return [];
  }
}

import * as Figma from 'figma-js';

export interface RuleConstructor {
  new (): IRule;
}

export interface IRule {
  visit: (node: Figma.Node) => void;
}

export abstract class AbstractRule implements IRule {
  constructor() {}
  visit(node: Figma.Node): void {}
}

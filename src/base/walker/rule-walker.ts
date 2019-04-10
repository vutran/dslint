import {AbstractWalker} from './';

export abstract class RuleWalker<T = {}> extends AbstractWalker
  implements DSLint.RuleWalker {
  options: T & DSLint.RuleWalkerOptions;
  failures: DSLint.Rules.Failure[];

  constructor(node: Figma.Node, options?: T & DSLint.RuleWalkerOptions) {
    super(node, options);
    this.failures = [];
  }

  addFailure(failure: DSLint.Rules.Failure) {
    this.failures.push(failure);
  }

  getRuleName() {
    return this.options.ruleName;
  }

  getAllFailures() {
    return this.failures;
  }
}

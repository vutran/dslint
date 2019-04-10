import {AbstractWalker} from './';

export abstract class RuleWalker<T = {}> extends AbstractWalker
  implements DSLint.RuleWalker {
  options: T & DSLint.RuleWalkerOptions;
  failures: DSLint.Rules.Failure[];

  constructor(node: Figma.Node, options?: T & DSLint.RuleWalkerOptions) {
    super(node, options);
    this.failures = [];
  }

  public getRuleName() {
    return this.options.ruleName;
  }

  public addFailure(failure: DSLint.Rules.Failure) {
    this.failures.push(failure);
  }

  public getAllFailures() {
    return this.failures;
  }
}

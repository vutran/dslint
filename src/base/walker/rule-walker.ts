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

  public addFailure(failure: DSLint.Rules.AddFailure) {
    const {ruleName} = this.options;
    this.failures.push({ruleName, ...failure});
  }

  public getAllFailures() {
    return this.failures;
  }
}

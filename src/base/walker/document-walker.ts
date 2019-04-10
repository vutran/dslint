import {AbstractWalker} from './';

export class DocumentWalker extends AbstractWalker
  implements DSLint.DocumentWalker {
  options: DSLint.DocumentRuleWalkerOptions;
  failures: DSLint.Rules.Failure[];

  constructor(
    node: Figma.Nodes.Document,
    options: DSLint.DocumentRuleWalkerOptions
  ) {
    super(node, options);
    this.failures = [];
  }

  public addFailure(failure: DSLint.Rules.Failure) {
    this.failures.push(failure);
  }

  public getAllFailures() {
    return this.failures;
  }

  public visit(node: Figma.Nodes.Document) {
    const {rules, file, localStyles} = this.options;
    rules.forEach(rule => {
      this.failures = this.failures.concat(
        rule.apply(node, this.options.file, this.options.localStyles)
      );
    });
    super.visit(node);
  }
}

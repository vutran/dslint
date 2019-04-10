import {AbstractWalker} from './';

export class DocumentWalker extends AbstractWalker
  implements DSLint.DocumentWalker {
  options: DSLint.DocumentRuleWalkerOptions;
  config: DSLint.Configuration;
  failures: DSLint.Rules.Failure[];

  constructor(
    node: Figma.Nodes.Document,
    options: DSLint.DocumentRuleWalkerOptions,
    config: DSLint.Configuration
  ) {
    super(node, options);
    this.config = config;
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
    const {matchName} = this.config;
    rules.forEach(rule => {
      const shouldApply = !matchName || node.name.includes(matchName);
      if (shouldApply) {
        this.failures = this.failures.concat(
          rule.apply(node, this.options.file, this.options.localStyles)
        );
      }
    });
    super.visit(node);
  }
}

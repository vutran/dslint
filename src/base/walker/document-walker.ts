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

  addFailure(failure: DSLint.Rules.Failure) {
    this.failures.push(failure);
  }

  getAllFailures() {
    return this.failures;
  }

  visit(node: Figma.Nodes.Document) {
    const {rules, file, localStyles} = this.options;
    rules.forEach(rule => {
      this.failures = this.failures.concat(
        rule.apply(node, this.options.file, this.options.localStyles)
      );
    });
    super.visit(node);
  }
}

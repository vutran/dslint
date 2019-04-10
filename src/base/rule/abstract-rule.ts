export abstract class AbstractRule implements DSLint.Rules.AbstractRule {
  metadata: DSLint.Rules.Metadata;
  failures: DSLint.Rules.Failure[];

  constructor(metadata: DSLint.Rules.Metadata) {
    this.metadata = metadata;
    this.failures = [];
  }

  getRuleName() {
    return this.metadata.ruleName;
  }

  getAllFailures() {
    return this.failures;
  }

  addFailure(failure: DSLint.Rules.Failure) {
    this.failures.push(failure);
  }

  apply(
    node: Figma.Node,
    file: Figma.File,
    localStyles: Figma.LocalStyles
  ): DSLint.Rules.Failure[] {
    return this.getAllFailures();
  }

  applyWithWalker(walker: DSLint.RuleWalker): DSLint.Rules.Failure[] {
    walker.walk(walker.getNode());
    return walker.getAllFailures();
  }
}

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

  init(client: Figma.Client.Client, file: Figma.File) {}

  apply(node: Figma.Node, file: Figma.File): DSLint.Rules.Failure[] {
    return [];
  }

  applyWithWalker(walker: DSLint.Walker): DSLint.Rules.Failure[] {
    return [];
  }
}

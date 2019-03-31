export abstract class AbstractRule implements DSLint.Rules.AbstractRule {
  metadata: DSLint.Rules.Metadata;

  constructor(metadata: DSLint.Rules.Metadata) {
    this.metadata = metadata;
  }

  getRuleName() {
    return this.metadata.ruleName;
  }

  apply(node: Figma.Node): DSLint.Rules.Failure[] {
    return [];
  }
}

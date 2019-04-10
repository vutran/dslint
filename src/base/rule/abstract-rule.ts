export abstract class AbstractRule implements DSLint.Rules.AbstractRule {
  metadata: DSLint.Rules.Metadata;

  constructor(metadata: DSLint.Rules.Metadata) {
    this.metadata = metadata;
  }

  public getRuleName() {
    return this.metadata.ruleName;
  }

  public abstract apply(
    node: Figma.Node,
    file: Figma.File,
    localStyles: Figma.LocalStyles
  ): DSLint.Rules.Failure[];

  public applyWithWalker(walker: DSLint.RuleWalker): DSLint.Rules.Failure[] {
    walker.walk(walker.getNode());
    return walker.getAllFailures();
  }
}

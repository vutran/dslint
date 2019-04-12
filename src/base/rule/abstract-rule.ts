export abstract class AbstractRule implements DSLint.Rules.AbstractRule {
  public abstract apply(
    file: Figma.File,
    localStyles: Figma.LocalStyles
  ): DSLint.Rules.Failure[];

  public applyWithWalker(walker: DSLint.RuleWalker): DSLint.Rules.Failure[] {
    walker.walk(walker.getNode());
    return walker.getAllFailures();
  }
}

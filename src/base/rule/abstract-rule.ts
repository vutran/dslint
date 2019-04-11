export abstract class AbstractRule implements DSLint.Rules.AbstractRule {
  public ruleDidLoad(
    file: Figma.File,
    client: Figma.Client.Client,
    config: DSLint.Configuration
  ): void {}

  public abstract apply(
    file: Figma.File,
    config: DSLint.Configuration
  ): DSLint.Rules.Failure[];

  public applyWithWalker(walker: DSLint.RuleWalker): DSLint.Rules.Failure[] {
    walker.walk(walker.getNode());
    return walker.getAllFailures();
  }
}

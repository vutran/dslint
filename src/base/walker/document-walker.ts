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

  /**
   * The document walker will travese the entire tree if there's no matching name.
   * If there's a `config.matchName` is set, the set of rules are applied to the matched
   * node and it's children via the rule walker so we can avoid walking from the document walker.
   */
  public visit(node: Figma.Node) {
    const {matchName} = this.config;
    const shouldApply = !matchName || node.name.includes(matchName);
    if (shouldApply) {
      const {rules, file, localStyles} = this.options;
      rules.forEach(rule => {
        this.failures = this.failures.concat(
          rule.apply(node, this.options.file, this.options.localStyles)
        );
      });
    } else {
      super.visit(node);
    }
  }
}

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
   * Case-insensitive matching
   */
  private matchesName(node: Figma.Node) {
    const nodeName = this.config.nodeName;
    return (
      !nodeName || node.name.toLowerCase().includes(nodeName.toLowerCase())
    );
  }

  /**
   * The DocumentWalker will traverse the entire tree if the node passes any of the matchers.
   * If there's any matches for the current node, the set of rules are applied to the matched node
   * and it's children via the RuleWalker so we can avoid walking from the DocumentWalker.
   */
  public visit(node: Figma.Node) {
    if (this.matchesName(node)) {
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

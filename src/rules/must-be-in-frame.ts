import {AbstractRule} from '../base/rule';
import {RuleWalker} from '../base/walker';

/**
 * All drawable nodes must be in a frame.
 *
 * Limitations: Will not work if using `--matchName`, the walker entry point should start at the
 * Canvas level
 */
export class Rule extends AbstractRule {
  static metadata: DSLint.Rules.Metadata = {
    ruleName: 'must-be-in-frame',
    description: 'All drawable nodes must be in a frame.',
  };

  apply(node: Figma.Node & Figma.Mixins.Children): DSLint.Rules.Failure[] {
    const ruleName = Rule.metadata.ruleName;
    // Ensure we are only walking if the entry is of a Canvas type
    if (node.type !== 'CANVAS') {
      return [];
    }
    return this.applyWithWalker(new InFrameWalker(node, {ruleName}));
  }
}

class InFrameWalker extends RuleWalker {
  visitCanvas(node: Figma.Node & Figma.Mixins.Children) {
    node.children.forEach(child => {
      // Assert that non-FRAME children are drawable nodes (vector, text, etc.)
      if (child.type !== 'FRAME') {
        this.addFailure({
          location: child.id,
          node: child,
          message: `Expected "${child.name}" to be in a Frame`,
        });
      }
    });
  }
}

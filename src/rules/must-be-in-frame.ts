import {AbstractRule} from '../base/rule';
import {RuleWalker} from '../base/walker';

/**
 * All drawable nodes must be in a frame.
 */
export class Rule extends AbstractRule {
  static metadata: DSLint.Rules.Metadata = {
    ruleName: 'must-be-in-frame',
    description: 'All drawable nodes must be in a frame.',
  };

  apply(node: Figma.Node & Figma.Mixins.Children): DSLint.Rules.Failure[] {
    const ruleName = this.getRuleName();
    return this.applyWithWalker(new InFrameWalker(node, {ruleName}));
  }
}

class InFrameWalker extends RuleWalker {
  visit(node: Figma.Node & Figma.Mixins.Children) {
    // Ensure we only run this if the walker started at Canvas
    if (node.type !== 'CANVAS') {
      return;
    }

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

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

  apply(file: Figma.File): DSLint.Rules.Failure[] {
    const ruleName = Rule.metadata.ruleName;
    return this.applyWithWalker(new InFrameWalker(file.document, {ruleName}));
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

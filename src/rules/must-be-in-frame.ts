import {AbstractRule} from '../utils/abstractRule';

/**
 * All drawable nodes must be in a frame.
 */
export class Rule extends AbstractRule {
  apply(node: Figma.Node & Figma.Mixins.Children): DSLint.Rules.Failure[] {
    if (node.type === 'CANVAS') {
      const ruleName = this.getRuleName();
      node.children.forEach(child => {
        // Assert that non-FRAME children are drawable nodes (vector, text, etc.)
        if (child.type !== 'FRAME') {
          this.addFailure({
            ruleName,
            node: child,
            message: `All shapes, vectors, and text must belong within a frame: ${
              node.name
            }`,
          });
        }
      });
    }
    return this.getAllFailures();
  }
}

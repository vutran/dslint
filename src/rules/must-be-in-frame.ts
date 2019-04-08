import {AbstractRule} from '../utils/abstractRule';

/**
 * All drawable nodes must be in a frame.
 */
export class Rule extends AbstractRule {
  apply(node: Figma.Node & Figma.Mixins.Children): DSLint.Rules.Failure[] {
    // Ensure we only run this if the walker started at Canvas
    if (node.type !== 'CANVAS') {
      return [];
    }
    const ruleName = this.getRuleName();
    node.children.forEach(child => {
      // Assert that non-FRAME children are drawable nodes (vector, text, etc.)
      if (child.type !== 'FRAME') {
        this.addFailure({
          ruleName,
          node: child,
          message: `All shapes, vectors, and text must belong within a frame: ${
            child.name
          }`,
        });
      }
    });
    return this.getAllFailures();
  }
}

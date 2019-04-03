import {AbstractRule} from '../utils/abstractRule';
import {AbstractWalker} from '../utils/abstractWalker';

/**
 * All drawable nodes must be in a frame.
 */
export class Rule extends AbstractRule {
  apply(node: Figma.Node & Figma.Mixins.Children): DSLint.Rules.Failure[] {
    const ruleName = this.getRuleName();
    return this.applyWithWalker(new CanvasWalker(node, {ruleName}));
  }
}

class CanvasWalker extends AbstractWalker {
  visitCanvas(node: Figma.Nodes.Canvas) {
    // Ensure we only run this if the walker started at Canvas
    if (this.getNode().type !== 'CANVAS') {
      return;
    }
    node.children.forEach(child => {
      // Assert that non-FRAME children are drawable nodes (vector, text, etc.)
      if (child.type !== 'FRAME') {
        this.addFailure({
          ruleName: this.options.ruleName,
          node: child,
          message: `All shapes, vectors, and text must belong within a frame: ${
            child.name
          }`,
        });
      }
    });
  }
}

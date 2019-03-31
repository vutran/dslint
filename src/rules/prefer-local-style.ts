import {AbstractRule} from '../utils/abstractRule';

/**
 * Prefer local style over hard-coded colors.
 */
export class Rule extends AbstractRule {
  apply(node: Figma.Node): DSLint.Rules.Failure[] {
    const ruleName = this.getRuleName();
    if (node.type !== 'DOCUMENT' && node.type !== 'CANVAS') {
      const localStyles = (node as DSLint.AnyType).styles as DSLint.AnyType;

      // Fills, strokes, and effects are available regardless if there's a local style applied
      // or not. It can be assumed that the node is using a one-off color if there are inline styles,
      // but no local styles associated.

      const fills = (node as DSLint.AnyType).fills as DSLint.AnyType[];
      const strokes = (node as DSLint.AnyType).strokes as DSLint.AnyType[];
      const effects = (node as DSLint.AnyType).effects as DSLint.AnyType[];

      const isInlineFill =
        !(localStyles && localStyles.fill) && fills && fills.length > 0;
      const isInlineStroke =
        !(localStyles && localStyles.stroke) && strokes && strokes.length > 0;
      const isInlineEffect =
        !(localStyles && localStyles.effect) && effects && effects.length > 0;

      if (isInlineFill || isInlineStroke || isInlineEffect) {
        return [
          {
            ruleName,
            node,
            message: `Prefer local styles.`,
          },
        ];
      }
    }
    return [];
  }
}

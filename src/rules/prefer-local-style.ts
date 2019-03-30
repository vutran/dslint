import { AbstractRule, RuleFailure } from '../utils/abstractRule';

/**
 * Prefer local style over hard-coded colors.
 */
export class Rule extends AbstractRule {
  apply(): RuleFailure[] {
    const ruleName = this.getRuleName();
    const node = this.getNode();
    if (node.data.type !== 'DOCUMENT' && node.data.type !== 'CANVAS') {
      const localStyles = (node as AnyType).data.styles as AnyType;

      // Fills, strokes, and effects are available regardless if there's a local style applied
      // or not. It can be assumed that the node is using a one-off color if there are fills,
      // but no local styles associated.

      const fills = (node as AnyType).data.fills as AnyType[];
      const strokes = (node as AnyType).data.strokes as AnyType[];
      const effects = (node as AnyType).data.effects as AnyType[];

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

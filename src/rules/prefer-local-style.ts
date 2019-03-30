import * as Figma from 'figma-js';
import { AbstractRule, RuleFailure } from '../utils/abstractRule';

// TODO(vutran) - Remove when https://github.com/jongold/figma-js/pull/15/ is merged
type StyleKeyType =
  | 'fill'
  | 'stroke'
  | 'effect'
  | 'grid'
  | 'text'
  | 'background';
type StylesObject = { [K in StyleKeyType]?: string };

/**
 * Prefer local style over hard-coded colors.
 */
export class Rule extends AbstractRule {
  apply(): RuleFailure[] {
    const ruleName = this.getRuleName();
    const node = this.getNode();
    if (node.type !== 'DOCUMENT' && node.type !== 'CANVAS') {
      const localStyles = (node as any).styles as StylesObject;

      // Fills, strokes, and effects are available regardless if there's a local style applied
      // or not. It can be assumed that the node is using a one-off color if there are fills,
      // but no local styles associated.

      const fills = (node as any).fills as any[];
      const strokes = (node as any).strokes as any[];
      const effects = (node as any).effects as any[];

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

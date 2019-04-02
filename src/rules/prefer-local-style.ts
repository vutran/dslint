import {AbstractRule} from '../utils/abstractRule';

function isInlineFill(node: Figma.Node): node is Figma.Mixins.Fills {
  const localStyles = (node as Figma.Mixins.Styles).styles;
  const fills = (node as Figma.Mixins.Fills).fills;
  return !(localStyles && localStyles.fill) && fills && fills.length > 0;
}

function isInlineStroke(node: Figma.Node): node is Figma.Mixins.Strokes {
  const localStyles = (node as Figma.Mixins.Styles).styles;
  const strokes = (node as Figma.Mixins.Strokes).strokes;
  return !(localStyles && localStyles.stroke) && strokes && strokes.length > 0;
}

function isInlineEffect(node: Figma.Node): node is Figma.Mixins.Effects {
  const localStyles = (node as Figma.Mixins.Styles).styles;
  const effects = (node as Figma.Mixins.Effects).effects;
  return !(localStyles && localStyles.effect) && effects && effects.length > 0;
}

/**
 * Prefer local style over hard-coded colors.
 */
export class Rule extends AbstractRule {
  apply(node: Figma.Node, file: Figma.File) {
    const ruleName = this.getRuleName();
    if (node.type !== 'DOCUMENT' && node.type !== 'CANVAS') {
      // Fills, strokes, and effects are available regardless if there's a local style applied
      // or not. It can be assumed that the node is using a one-off color if there are inline styles,
      // but no local styles associated.

      if (isInlineFill(node)) {
        this.addFailure({
          ruleName,
          node,
          message: 'Prefer local styles for fill',
        });
      }

      if (isInlineStroke(node)) {
        this.addFailure({
          ruleName,
          node,
          message: `Prefer local styles for stroke.`,
        });
      }

      if (isInlineEffect(node)) {
        this.addFailure({
          ruleName,
          node,
          message: `Prefer local styles for effect.`,
        });
      }
    }
  }
}

import {AbstractRule} from '../utils/abstractRule';
import nearestColor from 'nearest-color';
import {
  isInlineFill,
  isInlineStroke,
  isInlineEffect,
  toRGB,
} from '../figma/helpers';

/**
 * Prefer Local Styles over hard-coded styles (fills, strokes, and effects).
 */
export class Rule extends AbstractRule {
  /**
   * Given the list of paints, find the nearest local style.
   */
  findNearestFills(
    paints: Figma.Property.Paint[],
    localStyles: Figma.LocalStyles
  ) {
    let rec;

    const colors = this.getColors(localStyles);

    const getRecommendedLocalStyle = nearestColor.from(colors);

    paints.forEach(paint => {
      rec = getRecommendedLocalStyle(toRGB(paint.color));
    });

    return rec; /* type: nearest-color.Color */
  }

  // Builds a list of color maps for recommendation (local style name => rgb/hex)
  getColors(localStyles: Figma.LocalStyles) {
    const colors: {[key: string]: DSLint.AnyType} = {};

    localStyles.forEach((style, styleId) => {
      // grab the color based on the local style type
      switch (style.metadata.style_type) {
        case 'FILL':
          const color = style.properties
            .filter(prop => prop.type === 'SOLID')
            .map(prop => toRGB(prop.color));
          colors[style.metadata.name] = color[0];
          break;
        case 'TEXT':
          // TODO(vutran) - pass
          break;
        case 'EFFECT':
          break;
        case 'GRID':
          // TODO(vutran) - pass
          break;
      }
    });

    return colors;
  }

  apply(
    node: Figma.Node,
    file: Figma.File,
    localStyles: Figma.LocalStyles
  ): DSLint.Rules.Failure[] {
    const ruleName = this.getRuleName();
    if (node.type !== 'DOCUMENT' && node.type !== 'CANVAS') {
      if (isInlineFill(node)) {
        // type: nearest-color.Color
        const rec: DSLint.AnyType = this.findNearestFills(
          node.fills,
          localStyles
        );

        this.addFailure({
          ruleName,
          node,
          message: `Prefer local styles for fill: ${
            node.name
          }. Recommended local style: ${rec.name}`,
        });
      }

      if (isInlineStroke(node)) {
        // type: nearest-color.Color
        const rec: DSLint.AnyType = this.findNearestFills(
          node.strokes,
          localStyles
        );

        this.addFailure({
          ruleName,
          node,
          message: `Prefer local styles for stroke: ${
            node.name
          }. Recommended local style: ${rec.name}`,
        });
      }

      if (isInlineEffect(node)) {
        this.addFailure({
          ruleName,
          node,
          message: `Prefer local styles for effect: ${node.name}`,
        });
      }
    }
    return this.getAllFailures();
  }
}

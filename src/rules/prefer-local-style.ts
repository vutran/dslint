import {AbstractRule} from '../utils/abstractRule';
import nearestColor from 'nearest-color';
import {
  isInlineFill,
  isInlineStroke,
  isInlineEffect,
  isInlineType,
  toRGB,
} from '../figma/helpers';

/**
 * Prefer Local Styles over hard-coded styles (fills, strokes, and effects).
 */
export class Rule extends AbstractRule {
  /**
   * Given the set of text style, find the nearest font style.
   * This is done by comparing all values and returning the local style with the most matches.
   * Each value is weighted differently: (size (4), family (3), weight (2), line-height (1))
   */
  findNearestTypes(
    style: Figma.Property.Type,
    localStyles: Figma.LocalStyles<Figma.Property.Type>
  ): Figma.Metadata.Style {
    // keep track of the best match
    let highest_point = 0;
    let highest = null;

    localStyles.forEach(localStyle => {
      let points = 0;
      if (localStyle.properties.fontSize == style.fontSize) {
        points += 4;
      }
      if (localStyle.properties.fontFamily == style.fontFamily) {
        points += 3;
      }
      if (localStyle.properties.fontWeight == style.fontWeight) {
        points += 2;
      }
      if (localStyle.properties.lineHeightPx == style.lineHeightPx) {
        points += 1;
      }
      if (points >= highest_point) {
        highest_point = points;
        highest = localStyle.metadata.node_id;
      }
    });

    return localStyles.get(highest).metadata;
  }

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
        case 'EFFECT':
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

      if (node.type === 'TEXT' && isInlineType(node)) {
        const rec = this.findNearestTypes(
          node.style,
          localStyles as any /* for typecheck */
        );

        this.addFailure({
          ruleName,
          node,
          message: `Prefer local styles for text: ${
            node.name
          }. Recommended text style: ${rec.name}`,
        });
      }
    }
    return this.getAllFailures();
  }
}

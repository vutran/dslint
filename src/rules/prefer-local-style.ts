import nearestColor from 'nearest-color';
import {AbstractRule} from '../base/rule';
import {RuleWalker} from '../base/walker';
import {
  isInlineFill,
  isInlineStroke,
  isInlineEffect,
  isInlineType,
  toRGB,
} from '../toolkits/figma';

/**
 * Prefer Local Styles over hard-coded styles (fills, strokes, and effects).
 */
export class Rule extends AbstractRule {
  apply(
    node: Figma.Node,
    file: Figma.File,
    localStyles: Figma.LocalStyles
  ): DSLint.Rules.Failure[] {
    const ruleName = this.getRuleName();
    return this.applyWithWalker(
      new LocalStyleWalker(node, {ruleName, localStyles})
    );
  }
}

interface LocalStyleWalkerOptions {
  localStyles: Figma.LocalStyles;
}

class LocalStyleWalker extends RuleWalker<LocalStyleWalkerOptions> {
  /**
   * Given the set of text style, find the nearest font style.
   * This is done by comparing all values and returning the local style with the most matches.
   * Each value is weighted differently: (size (4), family (3), weight (2), line-height (1))
   *
   * Limitations: There isn't any local style available in the file. While they may be loaded from
   * an external file, they won't actually be available the the API response until it is
   * referenced somewhere.
   */
  findNearestTypes(
    style: Figma.Property.Type,
    localStyles: Figma.LocalStyles<Figma.Property.Type>
  ): Figma.Metadata.Style {
    // keep track of the best match
    let highestPoint = 0;
    let highest = null;

    // keep track of the best font size
    let bestFontSizeDist = 0;
    let bestFontSize = 0;

    localStyles.forEach(localStyle => {
      if (!localStyle || !localStyle.metadata) {
        return;
      }

      let points = 0;
      if (localStyle.properties.fontSize == style.fontSize) {
        points += 4;
      } else {
        let sizeMatch = false;
        if (!bestFontSize) {
          sizeMatch = true;
        } else {
          const dist = Math.abs(
            localStyle.properties.fontSize - style.fontSize
          );
          if (dist < bestFontSizeDist) {
            sizeMatch = true;
          }
        }
        if (sizeMatch) {
          bestFontSize = localStyle.properties.fontSize;
          bestFontSizeDist = Math.abs(
            localStyle.properties.fontSize - style.fontSize
          );
          points += 4;
        }
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
      if (points >= highestPoint) {
        highestPoint = points;
        highest = localStyle.metadata.node_id;
      }
    });

    return highest && localStyles.get(highest).metadata;
  }

  /**
   * Given the list of paints, find the nearest local style.
   *
   * Limitations: There isn't any local style available in the file. While they may be loaded from
   * an external file, they won't actually be available the the API response until it is
   * referenced somewhere.
   */
  findNearestFills(
    paints: Figma.Property.Paint[],
    localStyles: Figma.LocalStyles
  ) {
    if (localStyles.size === 0) {
      return;
    }
    let rec;
    const colors = this.getColors(localStyles);

    if (Object.keys(colors).length > 0) {
      const getRecommendedLocalStyle = nearestColor.from(colors);

      paints.forEach(paint => {
        rec = getRecommendedLocalStyle(toRGB(paint.color));
      });
    }

    return rec; /* type: nearest-color.Color */
  }

  // Builds a list of color maps for recommendation (local style name => rgb/hex)
  getColors(localStyles: Figma.LocalStyles) {
    const colors: {[key: string]: DSLint.AnyType} = {};

    localStyles.forEach((style, styleId) => {
      if (!style || !style.metadata) {
        return;
      }

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

  visit(node: Figma.Node & Figma.Mixins.Children) {
    const {ruleName, localStyles} = this.options;

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
          message: `Prefer local styles for fill: ${node.name}.`,
          description: rec && `Recommended local style: ${rec.name}.`,
          ruleData: {
            type: 'fill',
            rec,
          },
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
          message: `Prefer local styles for stroke: ${node.name}.`,
          description: rec && `Recommended local style: ${rec.name}.`,
          ruleData: {
            type: 'stroke',
            rec,
          },
        });
      }

      if (isInlineEffect(node)) {
        this.addFailure({
          ruleName,
          node,
          message: `Prefer local styles for effect: ${node.name}`,
          ruleData: {
            type: 'effect',
          },
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
          message: `Prefer local styles for text: ${node.name}.`,
          description: rec && `Recommended text style: ${rec.name}`,
          thumbnail: rec.thumbnail_url,
          ruleData: {
            type: 'text',
            rec,
          },
        });
      }
    }
  }
}

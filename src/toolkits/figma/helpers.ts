import {AbstractWalker} from '../../base/walker';

// Fills, strokes, effects, and grids are available regardless if there's a local style applied
// or not. It can be assumed that the node is using a one-off color if there are inline styles,
// but no local styles associated.
type InlineFill = Figma.Mixins.Styles & Figma.Mixins.Fills;
type InlineStroke = Figma.Mixins.Styles & Figma.Mixins.Strokes;
type InlineEffect = Figma.Mixins.Styles & Figma.Mixins.Effects;
type InlineGrid = Figma.Mixins.Styles & Figma.Mixins.Grid;

// It can also be assumed that the node is using a one-off text style if there are inline
// type styles, but no local styles associated.
type InlineType = Figma.Mixins.Styles & Figma.Mixins.Type;

export function hasLocalFill(node: Figma.Node): node is InlineFill {
  const localStyles = (node as Figma.Mixins.Styles).styles;
  return !!(localStyles && localStyles.fill);
}

export function hasLocalStroke(node: Figma.Node): node is InlineStroke {
  const localStyles = (node as Figma.Mixins.Styles).styles;
  return !!(localStyles && localStyles.stroke);
}

export function hasLocalEffect(node: Figma.Node): node is InlineEffect {
  const localStyles = (node as Figma.Mixins.Styles).styles;
  return !!(localStyles && localStyles.effect);
}

export function hasLocalType(node: Figma.Node): node is InlineType {
  const localStyles = (node as Figma.Mixins.Styles).styles;
  return !!(localStyles && localStyles.text);
}

export function hasLocalGrid(node: Figma.Node): node is InlineGrid {
  const localStyles = (node as Figma.Mixins.Styles).styles;
  return !!(localStyles && localStyles.grid);
}

/** Returns true if the node has inline fills */
export function isInlineFill(node: Figma.Node): node is InlineFill {
  const fills = (node as Figma.Mixins.Fills).fills;
  const solidfills = fills && fills.filter(fill => fill.type === 'SOLID');
  return !hasLocalFill(node) && solidfills && solidfills.length > 0;
}

/** Returns true if the node has inline strokes */
export function isInlineStroke(node: Figma.Node): node is InlineStroke {
  const strokes = (node as Figma.Mixins.Strokes).strokes;
  return !hasLocalStroke(node) && strokes && strokes.length > 0;
}

/** Returns true if the node has inline effects */
export function isInlineEffect(node: Figma.Node): node is InlineEffect {
  const effects = (node as Figma.Mixins.Effects).effects;
  return !hasLocalEffect(node) && effects && effects.length > 0;
}

/** Returns true if the node has inline types */
export function isInlineType(node: Figma.Node): node is InlineType {
  const style = (node as Figma.Mixins.Type).style;
  return !hasLocalType(node) && style && Object.keys(style).length > 0;
}

/** Returns true if the node has inline layout grids */
export function isInlineGrid(node: Figma.Node): node is InlineGrid {
  const layoutGrids = (node as Figma.Mixins.Grid).layoutGrids;
  return !hasLocalGrid(node) && layoutGrids && layoutGrids.length > 0;
}

export function toRGB(color: Figma.Property.Color) {
  return {
    r: color.r * 255,
    g: color.g * 255,
    b: color.b * 255,
  };
}

export class LocalStyleWalker extends AbstractWalker {
  localStyles?: Map<
    Figma.StyleId,
    Figma.Property.LocalStyle[] | Figma.Property.Type
  >;

  constructor(node: Figma.Node) {
    super(node);
    this.localStyles = new Map();
  }

  visit(node: Figma.Node) {
    super.visit(node);

    if (hasLocalFill(node)) {
      this.localStyles.set(node.styles.fill, node.fills);
    }

    if (hasLocalStroke(node)) {
      this.localStyles.set(node.styles.stroke, node.strokes);
    }

    if (hasLocalEffect(node)) {
      this.localStyles.set(node.styles.effect, node.effects);
    }

    if (hasLocalGrid(node)) {
      this.localStyles.set(node.styles.grid, node.layoutGrids);
    }

    if (hasLocalType(node)) {
      this.localStyles.set(node.styles.text, node.style);
    }
  }

  getLocalStyles() {
    return this.localStyles;
  }
}

/**
 * Fetches all local style for the given file.
 *
 * NOTE(vutran) - Previously tried the /v1/styles/:key endpoint but it doesn't return the
 * proper data (fill/stroke/effect/text values) for the given style. Instead, we're going to just
 * recurse through all nodes in `file` and extract the associated values if a local style
 * is applied.
 */
export async function getLocalStyles(
  file: Figma.File,
  client: Figma.Client.Client
): Promise<Figma.LocalStyles> {
  const metadata = new Map();

  const styleIdToKey = new Map();

  Object.entries(file.styles).forEach(([key, value]) => {
    styleIdToKey.set(key, value.key);
  });

  const keys = Array.from(styleIdToKey.values());

  for (const key of keys) {
    try {
      const style = (await client.styles(key)).body.meta;
      metadata.set(key, style);
    } catch (err) {
      console.error(
        `Oops, failed trying to load a style ${key}. Please make sure your file is published.`
      );
    }
  }

  // extract the properties from the document tree
  const walker = new LocalStyleWalker(file.document);
  walker.walk(file.document);
  const properties = walker.getLocalStyles();

  // builds the local style (metadata + properties) map
  const localStyles = new Map();
  for (const styleId of Array.from(properties.keys())) {
    const styleKey = styleIdToKey.get(styleId);
    localStyles.set(styleId, {
      metadata: metadata.get(styleKey),
      properties: properties.get(styleId),
    });
  }

  return Promise.resolve(localStyles);
}

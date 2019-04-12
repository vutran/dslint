import {AbstractRule} from '../base/rule';
import contrastRatio from 'contrast-ratio';
import {RuleWalker} from '../base/walker';
import {toRGB} from '../toolkits/figma';

/**
 * Check if a component complies to the WCAG 2.0 contrast ratio of 4.5:1
 */
export class Rule extends AbstractRule {
  static metadata = {
    ruleName: 'a11y-contrast-ratio',
    description:
      'Check if a component complies to the WCAG 2.0 contrast ratio of 4.5:1.',
  };

  apply(file: Figma.File): DSLint.Rules.Failure[] {
    const ruleName = Rule.metadata.ruleName;
    return this.applyWithWalker(new ComponentWalker(file.document, {ruleName}));
  }
}

class ComponentWalker extends RuleWalker {
  fg: DSLint.Color[];
  bg: DSLint.Color[];

  constructor(node: Figma.Node, options: DSLint.RuleWalkerOptions) {
    super(node, options);
    this.bg = [];
    this.fg = [];
  }

  private getFills(node: Figma.Node & Figma.Mixins.Fills) {
    return node.fills
      .filter(fill => fill.type === 'SOLID')
      .map(fill => fill.color);
  }

  private addBg(fills: Figma.Property.Color[]) {
    fills.forEach(fill => {
      this.bg.push(toRGB(fill));
    });
  }

  private addFg(fills: Figma.Property.Color[]) {
    fills.forEach(fill => {
      this.fg.push(toRGB(fill));
    });
  }

  private check(node: Figma.Node, fgs: DSLint.Color[], bgs: DSLint.Color[]) {
    if (fgs.length === 0 || bgs.length === 0) {
      return;
    }

    fgs.forEach(fg => {
      bgs.forEach(bg => {
        const ratio = contrastRatio([fg.r, fg.g, fg.b], [bg.r, bg.g, bg.b]);
        const passed = ratio > 4.5;
        if (!passed) {
          this.addFailure({
            location: node.id,
            message: `Contrast ratio does not meet 4.5:1 for "${node.name}"`,
          });
        }
      });
    });
  }

  visitComponent(node: Figma.Nodes.Component) {
    // Ensure we start over each time we visit a new component
    this.bg = [];
    this.fg = [];
    // Calls the super method to walk children to collect child fills before running our checks
    super.visitComponent(node);
    this.check(node, this.fg, this.bg);
  }

  // FOREGROUND

  visitText(node: Figma.Nodes.Text) {
    const fills = this.getFills(node);
    this.addFg(fills);
  }

  // BACKGROUND

  visitRectangle(node: Figma.Nodes.Rectangle) {
    const fills = this.getFills(node);
    this.addBg(fills);
  }

  visitEllipse(node: Figma.Nodes.Ellipse) {
    const fills = this.getFills(node);
    this.addBg(fills);
  }

  visitLine(node: Figma.Nodes.Line) {
    const fills = this.getFills(node);
    this.addBg(fills);
  }

  visitVector(node: Figma.Nodes.Vector) {
    const fills = this.getFills(node);
    this.addBg(fills);
  }

  visitStar(node: Figma.Nodes.Star) {
    const fills = this.getFills(node);
    this.addBg(fills);
  }
}

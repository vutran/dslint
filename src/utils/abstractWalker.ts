export abstract class AbstractWalker implements DSLint.Walker {
  node: Figma.Node;
  options: DSLint.WalkerOptions;
  failures: DSLint.Rules.Failure[];

  // TODO(vutran) - Decouple walker for a generic walker and a rule walker
  // since we're using this outside of rules
  constructor(node: Figma.Node, options?: DSLint.WalkerOptions) {
    this.node = node;
    this.options = options;
    this.failures = [];
  }

  getNode() {
    return this.node;
  }

  addFailure(failure: DSLint.Rules.Failure) {
    this.failures.push(failure);
  }

  getAllFailures() {
    return this.failures;
  }

  visit(node: Figma.Node) {
    switch (node.type) {
      case 'DOCUMENT':
        this.visitDocument(node);
        break;
      case 'CANVAS':
        this.visitCanvas(node as Figma.Nodes.Canvas);
        break;
      case 'FRAME':
        this.visitFrame(node as Figma.Nodes.Frame);
        break;
      case 'GROUP':
        this.visitGroup(node as Figma.Nodes.Group);
        break;
      case 'BOOLEAN_OPERATION':
        this.visitBooleanOperation(node as Figma.Nodes.BooleanOperation);
        break;
      case 'STAR':
        this.visitStar(node as Figma.Nodes.Star);
        break;
      case 'LINE':
        this.visitLine(node as Figma.Nodes.Line);
        break;
      case 'ELLIPSE':
        this.visitEllipse(node as Figma.Nodes.Ellipse);
        break;
      case 'REGULAR_POLYGON':
        this.visitRegularPolygon(node as Figma.Nodes.RegularPolygon);
        break;
      case 'RECTANGLE':
        this.visitRectangle(node as Figma.Nodes.Rectangle);
        break;
      case 'TEXT':
        this.visitText(node as Figma.Nodes.Text);
        break;
      case 'SLICE':
        this.visitSlice(node as Figma.Nodes.Slice);
        break;
      case 'COMPONENT':
        this.visitComponent(node as Figma.Nodes.Component);
        break;
      case 'INSTANCE':
        this.visitInstance(node as Figma.Nodes.Instance);
        break;
    }
  }

  visitDocument(node: Figma.Nodes.Document) {
    this.walkChildren(node);
  }

  visitCanvas(node: Figma.Nodes.Canvas) {
    this.walkChildren(node);
  }

  visitFrame(node: Figma.Nodes.Frame) {
    this.walkChildren(node);
  }

  visitGroup(node: Figma.Nodes.Group) {
    this.walkChildren(node);
  }

  visitBooleanOperation(node: Figma.Nodes.BooleanOperation) {
    this.walkChildren(node);
  }

  visitStar(node: Figma.Nodes.Star) {
    this.walkChildren(node);
  }

  visitLine(node: Figma.Nodes.Line) {
    this.walkChildren(node);
  }

  visitEllipse(node: Figma.Nodes.Ellipse) {
    this.walkChildren(node);
  }

  visitRegularPolygon(node: Figma.Nodes.RegularPolygon) {
    this.walkChildren(node);
  }

  visitRectangle(node: Figma.Nodes.Rectangle) {
    this.walkChildren(node);
  }

  visitText(node: Figma.Nodes.Text) {
    this.walkChildren(node);
  }

  visitSlice(node: Figma.Nodes.Slice) {
    this.walkChildren(node);
  }

  visitComponent(node: Figma.Nodes.Component) {
    this.walkChildren(node);
  }

  visitInstance(node: Figma.Nodes.Component) {
    this.walkChildren(node);
  }

  walk(node: Figma.Node) {
    this.visit(node);
  }

  walkChildren(node: Figma.Node & Figma.Mixins.Children) {
    if (node.children) {
      node.children.forEach(child => {
        this.visit(child);
      });
    }
  }
}

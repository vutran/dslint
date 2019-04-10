export abstract class AbstractWalker implements DSLint.Walker {
  node: Figma.Node;
  options: DSLint.WalkerOptions;

  constructor(node: Figma.Node, options?: DSLint.WalkerOptions) {
    this.node = node;
    this.options = options;
  }

  public getNode() {
    return this.node;
  }

  public visit(node: Figma.Node) {
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

  public visitDocument(node: Figma.Nodes.Document) {
    this.walkChildren(node);
  }

  public visitCanvas(node: Figma.Nodes.Canvas) {
    this.walkChildren(node);
  }

  public visitFrame(node: Figma.Nodes.Frame) {
    this.walkChildren(node);
  }

  public visitGroup(node: Figma.Nodes.Group) {
    this.walkChildren(node);
  }

  public visitBooleanOperation(node: Figma.Nodes.BooleanOperation) {
    this.walkChildren(node);
  }

  public visitStar(node: Figma.Nodes.Star) {
    this.walkChildren(node);
  }

  public visitLine(node: Figma.Nodes.Line) {
    this.walkChildren(node);
  }

  public visitEllipse(node: Figma.Nodes.Ellipse) {
    this.walkChildren(node);
  }

  public visitRegularPolygon(node: Figma.Nodes.RegularPolygon) {
    this.walkChildren(node);
  }

  public visitRectangle(node: Figma.Nodes.Rectangle) {
    this.walkChildren(node);
  }

  public visitText(node: Figma.Nodes.Text) {
    this.walkChildren(node);
  }

  public visitSlice(node: Figma.Nodes.Slice) {
    this.walkChildren(node);
  }

  public visitComponent(node: Figma.Nodes.Component) {
    this.walkChildren(node);
  }

  public visitInstance(node: Figma.Nodes.Component) {
    this.walkChildren(node);
  }

  public walk(node: Figma.Node) {
    this.visit(node);
  }

  public walkChildren(node: Figma.Node & Figma.Mixins.Children) {
    if (node.children) {
      node.children.forEach(child => {
        this.visit(child);
      });
    }
  }
}

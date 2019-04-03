export abstract class AbstractWalker implements DSLint.Walker {
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
    this.walk(node);
  }

  visitCanvas(node: Figma.Nodes.Canvas) {
    this.walk(node);
  }

  visitFrame(node: Figma.Nodes.Frame) {
    this.walk(node);
  }

  visitGroup(node: Figma.Nodes.Group) {
    this.walk(node);
  }

  visitBooleanOperation(node: Figma.Nodes.BooleanOperation) {
    this.walk(node);
  }

  visitStar(node: Figma.Nodes.Star) {
    this.walk(node);
  }

  visitLine(node: Figma.Nodes.Line) {
    this.walk(node);
  }

  visitEllipse(node: Figma.Nodes.Ellipse) {
    this.walk(node);
  }

  visitRegularPolygon(node: Figma.Nodes.RegularPolygon) {
    this.walk(node);
  }

  visitRectangle(node: Figma.Nodes.Rectangle) {
    this.walk(node);
  }

  visitText(node: Figma.Nodes.Text) {
    this.walk(node);
  }

  visitSlice(node: Figma.Nodes.Slice) {
    this.walk(node);
  }

  visitComponent(node: Figma.Nodes.Component) {
    this.walk(node);
  }

  visitInstance(node: Figma.Nodes.Component) {
    this.walk(node);
  }

  walk(node: Figma.Node & Figma.Mixins.Children) {
    node.children.forEach(child => {
      this.visit(child);
    });
  }
}

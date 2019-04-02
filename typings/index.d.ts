declare namespace DSLint {
  // Used for tracking `any` type
  type AnyType = any;

  namespace Rules {
    interface Failure {
      ruleName: string;
      message: string;
      // Optional since some rules can be applied at the global level
      node?: AnyType;
    }
    interface Metadata {
      ruleName: string;
    }

    interface AbstractRule {
      metadata: Metadata;
      failures: Failure[];
      getRuleName(): string;
      getAllFailures(): Failure[];
      addFailure(failure: Failure): void;
      init(client: Figma.Client.Client, file: Figma.File): void;
      apply(
        node: Figma.Node,
        file?: Figma.File,
        localStyles?: Figma.LocalStyles
      ): Failure[];
    }

    interface Constructor {
      new (metadata: Metadata): AbstractRule;
    }

    // Tuple hold the name of the rule and it's constructor
    type NameAndConstructor = [string, Constructor];
  }

  interface WalkerOptions {
    ruleName: string;
  }

  interface Walker {
    node: Figma.Node;
    options: WalkerOptions;
    failures: DSLint.Rules.Failure[];
    getNode(): Figma.Node;
    addFailure(failure: DSLint.Rules.Failure): void;
    getAllFailures(): DSLint.Rules.Failure[];
    visit(node: Figma.Node): void;
    visitDocument(node: Figma.Nodes.Document): void;
    visitCanvas(node: Figma.Nodes.Canvas): void;
    visitFrame(node: Figma.Nodes.Frame): void;
    visitGroup(node: Figma.Nodes.Group): void;
    visitBooleanOperation(node: Figma.Nodes.BooleanOperation): void;
    visitStar(node: Figma.Nodes.Star): void;
    visitLine(node: Figma.Nodes.Line): void;
    visitEllipse(node: Figma.Nodes.Ellipse): void;
    visitRegularPolygon(node: Figma.Nodes.RegularPolygon): void;
    visitRectangle(node: Figma.Nodes.Rectangle): void;
    visitText(node: Figma.Nodes.Text): void;
    visitSlice(node: Figma.Nodes.Slice): void;
    visitComponent(node: Figma.Nodes.Component): void;
    visitInstance(node: Figma.Nodes.Instance): void;
    walk(node: Figma.Node): void;
    walkChildren(node: Figma.Node & Figma.Mixins.Children): void;
  }
}

declare namespace Figma {
  namespace Client {
    type AuthKey = 'bearerAccessToken' | 'personalAccessToken';

    type Headers = AuthorizationHeaders | PersonalTokenHeaders;
    interface Options {
      bearerAccessToken?: string;
      personalAccessToken?: string;
    }

    interface AuthorizationHeaders {
      Authorization: string;
    }

    interface PersonalTokenHeaders {
      'X-Figma-Token': string;
    }
  }

  // Alias from DSLint typings
  type AnyType = DSLint.AnyType;

  // NOTE(vutran) - Any types that are currently missing in the public documentations should be set as `MissingType`.
  type MissingType = AnyType;

  type NodeType =
    | 'BOOLEAN_OPERATION'
    | 'CANVAS'
    | 'COMPONENT'
    | 'DOCUMENT'
    | 'ELLIPSE'
    | 'FRAME'
    | 'GROUP'
    | 'INSTANCE'
    | 'LINE'
    | 'RECTANGLE'
    | 'REGULAR_POLYGON'
    | 'SLICE'
    | 'STAR'
    | 'TEXT'
    | 'VECTOR';

  // This is usually in the format of "{m}:{n}" (eg: "1:1")
  type Identifier = string;
  type NodeId = Identifier;
  type StyleId = Identifier;

  interface Node {
    id: NodeId;
    name: string;
    visible: string;
    type: NodeType;
  }

  // NOTE(vutran) - This isn't in the public docs, but some node types can contain a collection of child nodes
  interface ParentNode<T = Node> extends Node {
    children?: T[];
  }

  interface File {
    name: string;
    lastModified: string;
    thumbnailURL: string;
    version: string;
    document: Nodes.Document;
    components: Map<NodeId, Property.Component>;
    schemaVersion: number;
    styles: Map<StyleId, Property.Style>;
  }

  namespace Nodes {
    /**
     * Node Types
     */
    interface Document extends ParentNode<Canvas> {}

    interface Canvas extends ParentNode {
      backgroundColor: Property.Color;
      prototypeStartNodeID: string;
      exportSettings: AnyType[];
    }

    interface Frame extends ParentNode {
      background: AnyType[];
      // @deprecated
      backgroundColor: AnyType;
      exportSettings: AnyType[];
      blendMode: AnyType;
      preserveRatio: boolean;
      constraints: AnyType;
      transitionID: string;
      transitionDuration: number;
      transitionEasing: AnyType;
      opacity: number;
      absoluteBoundingBox: AnyType;
      size: AnyType;
      relativeTransform: AnyType;
      clipsContent: boolean;
      layoutGrids: AnyType[];
      effects: AnyType[];
      isMask: boolean;
    }

    type Group = Frame;

    interface Vector extends Node {
      exportSettings: AnyType[];
      blendMode: AnyType;
      preserveRatio: boolean;
      constraints: AnyType;
      transitionNodeID: string;
      transitionDuration: number;
      transitionEasing: AnyType;
      opacity: number;
      absoluteBoundingBox: AnyType;
      effects: AnyType;
      size: AnyType;
      relativeTransform: AnyType;
      isMask: boolean;
      fills: AnyType[];
      fillGeometry: AnyType[];
      strokes: AnyType[];
      strokeWeight: number;
      strokeGeometry: AnyType[];
      strokeAlign: 'INSIDE' | 'OUTSIDE' | 'CENTER';
      styles: Map<AnyType, string>;
    }

    interface BooleanOperation extends Node {
      booleanOperation: 'UNION' | 'INTERSECT' | 'SUBTRACT';
    }

    type Star = Vector;

    type Line = Vector;

    type Ellipse = Vector;

    type RegularPolygon = Vector;

    interface Rectangle extends Vector {
      cornerRadius: number;
      rectangleCornerRadii: number[];
    }

    interface Text extends Vector {
      characters: string;
      style: AnyType;
      characterStyleOverrides: number[];
      styleOverrideTable: Map<number, AnyType>;
    }

    interface Slice extends Node {
      exportSettings: AnyType;
      absoluteBoundingBox: AnyType;
      vector: AnyType;
      relativeTransform: AnyType;
    }

    type Component = Frame;

    interface Instance extends Frame {
      componentId: string;
    }
  }

  /**
   * Property Types
   */
  namespace Property {
    interface Color {
      r: number;
      g: number;
      b: number;
      a: number;
    }

    interface ExportSetting {
      suffix: string;
      format: 'JPG' | 'PNG' | 'SVG';
      constraint: Constraint;
    }

    interface Constraint {
      type: 'SCALE' | 'WIDTH' | 'HEIGHT';
      value: number;
    }

    interface Rectangle {
      x: number;
      y: number;
      width: number;
      height: number;
    }

    type BlendMode =
      | 'PASS_THROUGH'
      | 'NORMAL'
      | 'DARKEN'
      | 'MULTIPLY'
      | 'LINEAR_BURN'
      | 'COLOR_BURN'
      | 'LIGHTEN'
      | 'SCREEN'
      | 'LINEAR_DODGE'
      | 'COLOR_DODGE'
      | 'OVERLAY'
      | 'SOFT_LIGHT'
      | 'HARD_LIGHT'
      | 'DIFFERENCE'
      | 'EXCLUSION'
      | 'HUE'
      | 'SATURATION'
      | 'COLOR'
      | 'LUMINOSITY';

    type EasingType = 'EASE_IN' | 'EASE_OUT' | 'EASE_IN_AND_OUT';

    interface LayoutConstraint {
      vertical: 'TOP' | 'BOTTOM' | 'CENTER' | 'TOP_BOTTOM' | 'SCALE';
      horizontal: 'LEFT' | 'RIGHT' | 'CENTER' | 'LEFT_RIGHT' | 'SCALE';
    }

    interface LayoutGrid {
      pattern: 'COLUMNS' | 'ROWS' | 'GRID';
      sectionSize: number;
      visible: boolean;
      color: Color;
      alignment: 'MIN' | 'MAX' | 'CENTER';
      gutterSize: number;
      offset: number;
      count: number;
    }

    interface Effect {
      type: 'INNER_SHADOW' | 'DROP_SHADOW' | 'LAYER_BLUR' | 'BACKGROUND_BLUR';
      visible: boolean;
      radius: number;
      color: Color;
      blendMode: BlendMode;
      offset: Vector;
    }

    interface Paint {
      type:
        | 'SOLID'
        | 'GRADIENT_LINEAR'
        | 'GRADIENT_RADIAL'
        | 'GRADIENT_ANGULAR'
        | 'GRADIENT_DIAMOND'
        | 'IMAGE'
        | 'EMOJI';
      visible: boolean;
      opacity: number;
      color: Color;
      blendMode: BlendMode;
      gradientHandlePositions: Vector[];
      gradientStops: ColorStop[];
      scaleMode: 'FILL' | 'FIT' | 'TILE' | 'STRETCH';
      imageTransform: Property.Transform;
      scalingFactor: number;
      imageRef: string;
    }

    interface Vector {
      x: number;
      y: number;
    }

    interface FrameOffset {
      node_id: string;
      node_offset: Vector;
    }

    interface ColorStop {
      position: number;
      color: Color;
    }

    interface TypeStyle {
      fontFamily: string;
      fontPostScriptName: string;
      italic: boolean;
      fontWeight: number;
      fontSize: number;
      textDecoration: 'STRIKETHROUGH' | 'UNDERLINE';
      textAlignHorizontal: 'LEFT' | 'RIGHT' | 'CENTER' | 'JUSTFIED';
      textAlignVertical: 'TOP' | 'CENTER' | 'BOTTOM';
      letterSpacing: number;
      fills: Paint[];
      lineHeightPx: number;
      lineHeightPercent: number;
    }

    interface Component {
      key: string;
      name: string;
      description: string;
    }

    interface Style {
      key: string;
      name: string;
      // NOTE(vutran) - In the public docs, this is defined as `style_type`, but the API returns `style_type`.
      styleType: 'FILL' | 'TEXT' | 'EFFECT' | 'GRID';
    }

    // NOTE(vutran) - Not sure if this is correct since it is missing in the doc.
    // Copied from: https://github.com/figma/figma-extension-api/blob/bce0eeb50d751cb5fc54c8f81bb5cf2e622440ef/types/index.d.ts#L145
    type Transform = [[number, number, number], [number, number, number]];
  }

  namespace Metadata {
    interface Component {
      key: string;
      file_key: string;
      node_id: string;
      thumbnail_url: string;
      name: string;
      description: string;
      created_at: string;
      updated_at: string;
      user: User;
      containing_frame: FrameInfo;
      containing_page: PageInfo;
    }

    interface Style {
      key: string;
      file_key: string;
      node_id: string;
      style_type: 'FILL' | 'TEXT' | 'EFFECT' | 'GRID';
      thumbnail_url: string;
      name: string;
      description: string;
      created_at: string;
      updated_at: string;
      user: User;
      sort_position: string;
    }

    interface FrameInfo {
      node_id: string;
      name: string;
      background_color: string;
      page_id: string;
      page_name: string;
    }

    interface User {
      id: string;
      handle: string;
      img_url: string;
      email: string;
    }

    type PageInfo = MissingType;
  }
}

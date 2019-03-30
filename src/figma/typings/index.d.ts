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

type StrokeAlign = 'INSIDE' | 'OUTSIDE' | 'CENTER';

interface FileResponse {
  name: string;
  lastModified: string;
  thumbnailURL: string;
  version: string;
  document: Document;
  components: AnyType;
  schemaVersion: number;
  styles: AnyType;
}

interface Node {
  id: string;
  name: string;
  visible: string;
  type: NodeType;
}

interface BooleanOperation {
  booleanOperation: 'UNION' | 'INTERSECT' | 'SUBTRACT';
}

interface Canvas {
  backgroundColor: AnyType;
  prototypeStartNodeID: string;
  exportSettings: AnyType[];
}

interface Frame {
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

type Component = Frame;

type Group = Frame;

interface Document {
  children: AnyType[];
}

interface Vector {
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
  strokeAlign: StrokeAlign;
  styles: Map<AnyType, string>;
}

interface Text extends Vector {
  characters: string;
  style: AnyType;
  characterStyleOverrides: number[];
  styleOverrideTable: Map<number, AnyType>;
}

type Star = Vector;

interface Slice {
  exportSettings: AnyType;
  absoluteBoundingBox: AnyType;
  vector: AnyType;
  relativeTransform: AnyType;
}

type RegularPolygon = Vector;

interface Rectangle extends Vector {
  cornerRadius: number;
  rectangleCornerRadii: number[];
}

type Line = Vector;

type Ellipse = Vector;

interface Instance extends Frame {
  componentId: string;
}

type StyleType = 'FILL' | 'TEXT' | 'EFFECT' | 'GRID';
interface Style {
  key: string;
  file_key: string;
  node_id: string;
  style_type: StyleType;
  thumbnail_url: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  user: User;
  sort_position: string;
}

interface User {
  id: string;
  handle: string;
  img_url: string;
  email: string;
}

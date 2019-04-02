declare module 'nearest-color' {
  interface RGB {
    r: number;
    g: number;
    b: number;
  }
  interface Color {
    name: string;
    value: string;
    rgb: RGB;
    distance: number;
  }

  type GetColorFn = (color: RGB) => Color;

  export const nearestColor: any;
  export const from: (colors: any) => GetColorFn;
}

export function toRGB(color: Figma.Property.Color) {
  return {
    r: color.r * 255,
    g: color.g * 255,
    b: color.b * 255,
  };
}

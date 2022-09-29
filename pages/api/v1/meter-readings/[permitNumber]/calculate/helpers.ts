export const getPrecision = (n: number | undefined, defaultPrecision: number): number => {
  return n ? n.toString().replace('.', '').length : defaultPrecision
}
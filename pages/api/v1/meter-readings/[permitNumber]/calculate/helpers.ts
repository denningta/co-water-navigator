export const getPrecision = (n: number | undefined, defaultPrecision: number): number => {
  return n ? n.toString().replace('.', '').length : defaultPrecision
}

export const round = (number: number, deicmalPlaces: number) => {
    return Math.round((number + Number.EPSILON) * +("1e" + deicmalPlaces)) / +("1e" + deicmalPlaces)
}
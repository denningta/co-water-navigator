import { fql, Query } from "fauna"

export interface MeterReadingsQuery {
  permitNumbers?: string[]
  dates?: string[]
  years?: string[]
}

const getMeterReadings = (query: MeterReadingsQuery) => {

  const {
    permitNumbers,
    dates,
    years
  } = query as MeterReadingsQuery

  return fql`
    let setArray = [
      ${permitNumbers ? getMeterReadingsByPermitNumber(permitNumbers) : null},
      ${dates ? getMeterReadingsByDate(dates as string[]) : null},
      ${years ? getMeterReadingsByYear(years as string[]) : null}
    ].where(el => el != null)

    intersection(setArray)
      .order(asc((doc) => parseDate(doc.date).month))
      .order(asc((doc) => parseDate(doc.date).year))
  `
}

export const getMeterReadingsByPermitNumber = (permitNumbers: string[]) =>
  fql`
    meterReadings.where((doc) => ${permitNumbers}.includes(doc.permitNumber))
  `

export const getMeterReadingsByDate = (dates: string[]) =>
  fql`
    meterReadings.where((doc) => ${dates}.includes(doc.date))
  `


export const getMeterReadingsByYear = (years: string[]) => {

  const intYears = years.map(year => +year)

  return fql`
    meterReadings.where((doc) => {
      ${intYears}.includes(parseDate(doc.date).year) ||
      (
        ${intYears}.map(year => year - 1).includes(parseDate(doc.date).year) &&
        parseDate(doc.date).month == 12
      )
    })
  `
}

export default getMeterReadings

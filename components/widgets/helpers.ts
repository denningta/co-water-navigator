import MeterReading from "../../interfaces/MeterReading"
import { CalendarYearSelectorData } from "./CalendarYearSelector/CalendarYearSelector"

export function dateFormatter(params: any): string {

  const [year, month] = params.value.split('-')
  const date = new Date(Date.UTC(+year, +month - 1))
  return `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`
}

export function initPlaceholderData(permitNumber: string, year: string): MeterReading[] {
  const data: MeterReading[] = []
  
  for (let month = 1; month <= 12; month++) {

    data.push({ 
      permitNumber: permitNumber,
      date: `${year}-${month < 10 ? '0' + month : month}`
    })
  }

  data.unshift({
    permitNumber: permitNumber,
    date: `${(+year - 1).toString()}-12`
  })

  return data
}

export function initCalendarYearPlaceholderData(year: string, numberOfRecords: number): CalendarYearSelectorData[] {
  const data: CalendarYearSelectorData[] = []
  let y = Math.round(+year - numberOfRecords/2)

  for (let i = 1; i <= numberOfRecords; i++) {
    data.push({
      year: y.toString()
    })
    y++
  }

  return data
}
import { CalendarYearSelectorData } from "./CalendarYearSelector"

export function initCalendarYearPlaceholderData(year: string | undefined, numberOfRecords: number): CalendarYearSelectorData[] {
  if (!year) return []
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

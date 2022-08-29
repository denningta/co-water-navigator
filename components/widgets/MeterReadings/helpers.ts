import { CellClassParams, ValueGetterParams, ValueSetterParams } from "ag-grid-community"
import MeterReading from "../../../interfaces/MeterReading"
import { CalendarYearSelectorData } from "../CalendarYearSelector/CalendarYearSelector"

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

export function calculatedValueGetter({ data }: ValueGetterParams, field: string) {
  if (data[field] && data[field].value !== undefined) {
    if (['pumpedThisPeriod', 'pumpedYearToDate', 'availableThisYear'].includes(field)) {
      return data[field].shouldBe
    }
    console.log(field)
    return data[field].value
  } else {
    return data[field]
  }
}

export function calculatedValueSetter({ data, newValue }: ValueSetterParams, field: string) {
  if (data[field] && data[field].value === '') {
    delete data[field]
    return true
  }
  
  data[field] = {
    value: +newValue,
  }
  return true
}

export function getCellClassRules(field: string) {
  return {
    'bg-orange-500 bg-opacity-25': ({ value, data }: CellClassParams) => {
      if (value === undefined) return false;
      return data[field].calculationState === 'warning' && !data.comments;
    },
    'bg-gray-100': ({ colDef }: CellClassParams) => {
      return !colDef.editable
    },
    // global style in style.scss
    'bg-primary bg-opacity-50': ({ value, data }: CellClassParams) => {
      if (!value) return false;
      return data[field].calculationState === 'warning' && data.comments
    }
  }
}
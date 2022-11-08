import { CellClassParams, ValueFormatterFunc, ValueFormatterParams, ValueGetterParams, ValueSetterParams } from "ag-grid-community"
import { Database } from "faunadb"
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
    return data[field].value.toString()
  } else {
    return data[field]
  }
}

export function calculatedValueSetter({ data, newValue }: ValueSetterParams, field: string) {
  if (data[field] && newValue === '') {
    delete data[field]
    return true
  }
  
  data[field] = {
    value: +newValue,
    source: 'user'
  }
  return true
}

export function getCellClassRules(field: string) {
  return {
    'bg-orange-500 bg-opacity-25': ({ value, data }: CellClassParams) => {
      if (value === undefined) return false;
      return data[field].calculationState === 'warning' && !data.comments;
    },
    'bg-gray-500 bg-opacity-10': ({ colDef }: CellClassParams) => {
      return !colDef.editable
    },
    // global style in style.scss
    'bg-emerald-500 bg-opacity-30': ({ value, data }: CellClassParams) => {
      if (!value) return false;
      return data[field].calculationState === 'warning' && data.comments
    }
  }
}

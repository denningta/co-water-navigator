import { CellClassParams, ValueGetterParams, ValueSetterParams } from "ag-grid-community"
import MeterReading from "../../../interfaces/MeterReading"

export function dateFormatter(params: any): string {
  const [year, month] = params.value.split('-')
  const date = new Date(+year, +month, 0)
  const formattedDate = `${date.toLocaleString('default', { month: 'short', day: 'numeric' })} ${date.getFullYear()}`
  return formattedDate
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
  if (data[field] && (data[field].value !== undefined || data[field].value !== null)) {
    return data[field].value.toString()
  } else {
    return data[field]
  }
}

export function calculatedValueSetter(
  params: ValueSetterParams,
  field: string,
  validatorFn: (params: ValueSetterParams) => boolean
) {
  if (validatorFn(params)) {
    if (params.data[field] && params.newValue === '') {
      delete params.data[field]
      return true
    }

    params.data[field] = {
      value: +params.newValue,
      source: 'user'
    }
    return true
  } else {
    return false
  }

}

export function getCellClassRules(field: string) {
  return {
    'bg-warning-500 bg-opacity-25': ({ value, data }: CellClassParams) => {
      if (value === undefined || value === null) return false;
      return data[field].calculationState === 'warning' && !data.comments;
    },
    'bg-gray-500 bg-opacity-10': ({ colDef }: CellClassParams) => {
      return !colDef.editable
    },
    // global style in style.scss
    'bg-success-500 bg-opacity-30': ({ value, data }: CellClassParams) => {
      if (!value) return false;
      return data[field].calculationState === 'warning' && data.comments
    }
  }
}


import { CalculatedField } from "."
import MeterReading, { CalculatedValue } from "../../../../../../interfaces/MeterReading"


export const getPrecision = (n: number | undefined, defaultPrecision: number): number => {
  return n ? n.toString().replace('.', '').length : defaultPrecision
}

export const round = (number: number, deicmalPlaces: number) => {
  return Math.round((number + Number.EPSILON) * +("1e" + deicmalPlaces)) / +("1e" + deicmalPlaces)
}

interface ResultObject {
  prevFlowMeter?: CalculatedValue | undefined
  prevPowerMeter?: CalculatedValue | undefined
  prevPowerConsumptionCoef?: CalculatedValue | undefined
  prevPumpedThisPeriod?: CalculatedValue | undefined
  prevPumpedYearToDate?: CalculatedValue | undefined
  prevAvailableThisYear?: CalculatedValue | undefined
}

type PrevCalculatedField = 'prevFlowMeter' | 'prevPowerMeter' | 'prevPowerConsumptionCoef' |
  'prevPumpedThisPeriod' | 'prevPumpedYearToDate' | 'prevAvailableThisYear'

const calculatedFields: { property: CalculatedField, prevProperty: PrevCalculatedField }[] = [
  { property: 'flowMeter', prevProperty: 'prevFlowMeter' },
  { property: 'powerMeter', prevProperty: 'prevPowerMeter' },
  { property: 'powerConsumptionCoef', prevProperty: 'prevPowerConsumptionCoef' },
  { property: 'pumpedThisPeriod', prevProperty: 'prevPumpedThisPeriod' },
  { property: 'pumpedYearToDate', prevProperty: 'prevPumpedYearToDate' },
  { property: 'availableThisYear', prevProperty: 'prevAvailableThisYear' },
]

export function getPreviousValidCalculatedValues(
  meterReading: MeterReading,
  index: number,
  context: MeterReading[],
) {
  const resultObj: ResultObject = {}

  calculatedFields.forEach(({ property, prevProperty }) => {
    let prevValue: CalculatedValue | undefined = undefined
    for (let i = index - 1; i >= 0; i--) {
      if (context[i] && context[i][property] && !isUserDeleted(context[i][property])) {
        prevValue = context[i][property]
        break
      }
    }
    if (!prevValue) prevValue = { value: meterReading[property]?.value ?? 0 }
    resultObj[prevProperty] = prevValue
  })

  return resultObj
}

export function isUserDeleted(value: CalculatedValue | undefined): boolean {
  if (!value) return false
  if (value.value === 'user-deleted' || value.source === 'user-deleted') {
    return true
  } else {
    return false
  }
}

export function isNotDefined(value: CalculatedValue | undefined): boolean {
  if (!value) return false
  if (value.value === undefined || value.value === 'user-deleted') {
    return true
  } else {
    return false
  }
}

export function parseDate(date: string): { year: number, month: number } {
  const dateArray = date.split('-')

  return {
    year: +dateArray[0],
    month: +dateArray[1]
  }
}

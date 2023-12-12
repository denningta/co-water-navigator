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
      if (context[i] && context[i][property] && isDefined(context[i][property])) {
        prevValue = context[i][property]
        break
      }
    }
    if (!prevValue) prevValue = { value: meterReading[property]?.value ?? 0 }
    resultObj[prevProperty] = prevValue
  })

  return resultObj
}

export function isDefined(value: CalculatedValue | undefined): boolean {
  if (
    value === undefined
    || value.value === undefined
    || value.value === 'user-deleted'
    || isNaN(value.value)
  ) {
    return false
  } else {
    return true
  }
}

export function parseDate(date: string): { year: number, month: number } {
  const dateArray = date.split('-')

  return {
    year: +dateArray[0],
    month: +dateArray[1]
  }
}

export function getLastFlowMeterPrevYears(meterReadings: MeterReading[], meterReading: MeterReading): CalculatedValue | undefined {
  const thisYear = parseDate(meterReading.date).year

  return meterReadings
    .filter(el => parseDate(el.date).year <= (thisYear - 1))
    .sort((a, b) => {
      const aDate = parseDate(a.date)
      const bDate = parseDate(b.date)
      if (aDate.year !== bDate.year) {
        return bDate.year - aDate.year
      } else {
        return bDate.month - aDate.month
      }
    })
    .find(el => {
      if (el && el.flowMeter && isDefined(el.flowMeter)) {
        return el
      }
    })?.flowMeter
}

export type CalculatedValueProperties<T> = {
  [K in keyof T]: Exclude<T[K], undefined> extends CalculatedValue ? K : never;
}[keyof T];

export function sumCalculatedValues(meterReadings: MeterReading[], field: CalculatedValueProperties<MeterReading>) {
  // @ts-expect-error
  const array = meterReadings.filter(el => isDefined(el[field]))
  if (!array.length) return
  const sum = meterReadings.reduce((accumulator, item) => {
    // @ts-expect-error
    if (item && item[field] && isDefined(item[field])) {
      // @ts-expect-error
      return accumulator + item[field].value
    } else {
      return accumulator
    }
  }, 0)

  return +sum.toFixed(2)
}




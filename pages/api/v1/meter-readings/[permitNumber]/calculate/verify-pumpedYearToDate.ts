import _ from "lodash";
import MeterReading, { CalculatedValue } from "../../../../../../interfaces/MeterReading";
import { validateDate } from "../../../validatorFunctions";

const verifyPumpedYearToDate = (
  currentRecord: MeterReading,
  meterReadings: MeterReading[],
  currentIndex: number,
): CalculatedValue | undefined => {
  const readingsThisYear = getRecordsUpToDate(meterReadings, meterReadings[currentIndex].date)
  const thisYear = +currentRecord.date.split('-')[0]
  let shouldBe = undefined

  if (
    (currentRecord.flowMeter?.value === 'user-deleted' || currentRecord.flowMeter?.value === undefined)
    && (currentRecord.powerMeter?.value === 'user-deleted' || currentRecord.powerMeter?.value === undefined)
  ) return

  if (currentRecord.pumpedYearToDate?.source === 'user-deleted') return currentRecord.pumpedYearToDate

  if (currentRecord.pumpedThisPeriod?.value === 'user-deleted') {
    const lastFloMeterLastYear = _.last(getRecordsUpToDate(meterReadings, `${thisYear - 1}-12`))?.flowMeter?.value
    const lastFlowMeter = _.last(readingsThisYear)?.flowMeter?.value
    if (lastFloMeterLastYear === undefined || lastFlowMeter === undefined || lastFloMeterLastYear === 'user-deleted' || lastFlowMeter === 'user-deleted') return
    shouldBe = lastFlowMeter - lastFloMeterLastYear

  } else {
    shouldBe = readingsThisYear.reduce((n, { pumpedThisPeriod }) => {
      if (pumpedThisPeriod === undefined || pumpedThisPeriod?.value === undefined) return +n.toFixed(2)
      const value = pumpedThisPeriod.value as number
      return +(n + value).toFixed(2)
    }, 0)
  }


  const updatedValue: CalculatedValue = {
    ...currentRecord.pumpedYearToDate,
    value: shouldBe
  }

  if (currentRecord.pumpedYearToDate?.source === 'user') {
    updatedValue.value = currentRecord.pumpedYearToDate.value
    if (currentRecord.pumpedYearToDate.value !== shouldBe) {
      updatedValue.shouldBe = shouldBe
      updatedValue.calculationState = 'warning'
      updatedValue.calculationMessage = `Expected: ${shouldBe} acre feet.  Provide a comment to resolve this warning.`
    } else {
      delete updatedValue.shouldBe
      delete updatedValue.calculationState
      delete updatedValue.calculationMessage
    }
  }

  return updatedValue;
}

export const getMeterReadingsPerYear = (
  meterReadings: MeterReading[],
  currIndex: number
) => {
  if (meterReadings[currIndex]?.date && validateDate(meterReadings[currIndex].date) === 'invalid') {
    throw new Error(`Incorrect date format: ${meterReadings[currIndex].date}.  Expected YYYY-MM`)
  }

  const [currYear, currMonth] = meterReadings[currIndex].date.split('-')

  return meterReadings.filter(meterReading => {
    if (validateDate(meterReading.date) === 'invalid') {
      throw new Error(`Incorrect date format: ${meterReading.date}.  Expected YYYY-MM`)
    }
    const [year, month] = meterReading.date.split('-')
    return year === currYear && +month <= +currMonth
  })
}

export function getRecordsUpToDate(data: MeterReading[], currentDateString: string) {
  if (validateDate(currentDateString) == 'invalid') {
    throw new Error(`Incorrect date format: ${currentDateString}.  Expected YYYY-MM`)
  }

  const currentDate = new Date(currentDateString + '-01');
  const currentYear = currentDate.getFullYear();

  const recordsUpToDate = [];

  for (let i = 0; i < data.length; i++) {
    const recordDate = new Date(data[i].date + '-01');
    if (recordDate.getFullYear() === currentYear && recordDate <= currentDate) {
      recordsUpToDate.push(data[i]);
    }
  }

  return recordsUpToDate;
}

export default verifyPumpedYearToDate

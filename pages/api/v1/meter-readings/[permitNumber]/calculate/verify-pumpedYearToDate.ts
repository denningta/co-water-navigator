import MeterReading, { CalculatedValue } from "../../../../../../interfaces/MeterReading";
import { validateDate } from "../../../validatorFunctions";
import { getPrecision } from "./helpers";

const verifyPumpedYearToDate = (
  currentRecord: MeterReading,
  currentIndex: number,
  meterReadings: MeterReading[],
): CalculatedValue | undefined => {
  const readingsThisYear = getMeterReadingsPerYear(meterReadings, currentIndex)

  const shouldBe = readingsThisYear.reduce((n, { pumpedThisPeriod }) => {
    if (!pumpedThisPeriod) return +n.toFixed(2)
    return +(n + pumpedThisPeriod.value).toFixed(2)
  }, 0)

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
  if (validateDate(meterReadings[currIndex].date) === 'invalid') {
    throw new Error(`Incorrect date format: ${meterReadings[currIndex].date}.  Expected YYYY-MM`)
  }
  const [currYear, currMonth] = meterReadings[currIndex].date.split('-')

  return meterReadings.filter(meterReading => {
    if (validateDate(meterReading.date) === 'invalid') {
      throw new Error(`Incorrect date format: ${meterReading.date}.  Expected YYYY-MM`)
    }
    const [year, month] = meterReading.date.split('-')
    return year === currYear && month <= currMonth
  })
}

export default verifyPumpedYearToDate

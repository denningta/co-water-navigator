import MeterReading, { CalculatedValue } from "../../../../../../interfaces/MeterReading";
import { validateDate } from "../../validatorFunctions";

const verifyPumpedYearToDate = (
  meterReadings: MeterReading[], 
  currentIndex: number
): CalculatedValue | 'no update required' => {

  if (currentIndex === 0) return 'no update required'

  const readingsThisYear = getMeterReadingsPerYear(meterReadings, currentIndex)

  const shouldBe = readingsThisYear.reduce((n, {pumpedThisPeriod}) => {
    if (!pumpedThisPeriod) return n
    return n + pumpedThisPeriod.value
  }, 0)

  const currRecord = meterReadings[currentIndex]
  
  if (!currRecord.pumpedYearToDate) {
    return {
      value: shouldBe
    }
  }
  
  const updatedValue: CalculatedValue = {
    ...currRecord.pumpedYearToDate
  }
  
  if (currRecord.pumpedYearToDate.value !== shouldBe) {
    updatedValue.shouldBe = shouldBe
    updatedValue.calculationState = 'warning'
    updatedValue.calculationMessage = `Expected: ${shouldBe} acre feet.  Provide a comment to resolve this warning.`
  } else {
    delete updatedValue.shouldBe
    delete updatedValue.calculationState
    delete updatedValue.calculationMessage
  }

  if (
    currRecord.pumpedYearToDate.calculationMessage === updatedValue.calculationMessage
    && currRecord.pumpedYearToDate.calculationState === updatedValue.calculationState
    && currRecord.pumpedYearToDate.shouldBe === updatedValue.shouldBe
  ) return 'no update required'

  return updatedValue;
}

export const getMeterReadingsPerYear = (meterReadings: MeterReading[], currIndex: number) => {
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
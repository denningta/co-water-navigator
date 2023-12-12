import MeterReading, { CalculatedValue } from "../../../../../../interfaces/MeterReading";
import { getLastFlowMeterPrevYears, getPreviousValidCalculatedValues, parseDate, sumCalculatedValues } from "./helpers";

const verifyAvailableThisYear = (
  meterReading: MeterReading,
  pumpingLimitThisYear: number | undefined,
  meterReadings: MeterReading[],
  index: number,
): CalculatedValue | undefined => {
  let shouldBe: number | undefined = undefined
  const {
    prevAvailableThisYear
  } = getPreviousValidCalculatedValues(meterReading, index, meterReadings)


  // Calc Case 1
  const currentFlowMeter = meterReading.flowMeter?.value
  const pumpedThisPeriod = meterReading.pumpedThisPeriod?.value
  const lastFlowMeterLastYear = getLastFlowMeterPrevYears(meterReadings, meterReading)?.value
  const pumpedYearToDate = meterReading.pumpedYearToDate?.value
  const sumPumpedThisPeriod = sumCalculatedValues(
    meterReadings.filter((el) => parseDate(el.date).year === parseDate(meterReading.date).year),
    'pumpedThisPeriod'
  )


  if (
    typeof pumpingLimitThisYear === 'number' &&
    typeof currentFlowMeter === 'number' &&
    typeof lastFlowMeterLastYear === 'number'
  ) {
    shouldBe = pumpingLimitThisYear - (currentFlowMeter - lastFlowMeterLastYear)

  } else if (
    typeof pumpingLimitThisYear === 'number' &&
    typeof sumPumpedThisPeriod === 'number'
  ) {
    shouldBe = pumpingLimitThisYear - sumPumpedThisPeriod

  } else if (
    typeof pumpingLimitThisYear === 'number' &&
    typeof pumpedYearToDate === 'number'
  ) {
    shouldBe = pumpingLimitThisYear - pumpedYearToDate

  } else if (
    typeof prevAvailableThisYear?.value === 'number' &&
    typeof pumpedThisPeriod === 'number'
  ) {
    shouldBe = prevAvailableThisYear.value - pumpedThisPeriod

  } else {
    return
  }

  const updatedValue: CalculatedValue = {
    ...meterReading.availableThisYear,
    value: shouldBe
  }

  if (meterReading.availableThisYear?.source === 'user') {
    updatedValue.value = meterReading.availableThisYear.value
    if (meterReading.availableThisYear.value !== shouldBe) {
      updatedValue.shouldBe = shouldBe
      updatedValue.calculationState = 'warning'
      updatedValue.calculationMessage = `Expected: ${shouldBe} acre feet.`
    } else {
      delete updatedValue.shouldBe
      delete updatedValue.calculationState
      delete updatedValue.calculationMessage
    }
  }

  return updatedValue
}

export default verifyAvailableThisYear

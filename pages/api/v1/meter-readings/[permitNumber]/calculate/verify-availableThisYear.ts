import MeterReading, { CalculatedValue } from "../../../../../../interfaces/MeterReading";
import { getLastFlowMeterPrevYears, getPreviousValidCalculatedValues, parseDate, sumCalculatedValues } from "./helpers";

const verifyAvailableThisYear = (
  meterReading: MeterReading,
  pumpingLimitThisYear: number | undefined,
  meterReadings: MeterReading[],
  index: number,
): CalculatedValue | undefined => {
  let updatedValue: CalculatedValue | undefined = meterReading.availableThisYear
  let shouldBe: number | undefined = undefined

  const {
    prevAvailableThisYear
  } = getPreviousValidCalculatedValues(meterReading, index, meterReadings)
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
    updatedValue = { value: shouldBe }

  } else if (
    typeof pumpingLimitThisYear === 'number' &&
    typeof sumPumpedThisPeriod === 'number'
  ) {
    shouldBe = pumpingLimitThisYear - sumPumpedThisPeriod
    updatedValue = { value: shouldBe }
  } else if (
    typeof pumpingLimitThisYear === 'number' &&
    typeof pumpedYearToDate === 'number'
  ) {
    shouldBe = pumpingLimitThisYear - pumpedYearToDate
    updatedValue = { value: shouldBe }


  } else if (
    typeof prevAvailableThisYear?.value === 'number' &&
    typeof pumpedThisPeriod === 'number'
  ) {
    shouldBe = prevAvailableThisYear.value - pumpedThisPeriod
    updatedValue = { value: shouldBe }
  } else if (meterReading.availableThisYear?.value === 'user-deleted') {
    updatedValue = meterReading.availableThisYear
  }

  if (shouldBe !== undefined) updatedValue = { value: shouldBe }

  if (meterReading.availableThisYear?.source === 'user') {
    updatedValue = meterReading.availableThisYear
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

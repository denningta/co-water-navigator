import MeterReading, { CalculatedValue } from "../../../../../../interfaces/MeterReading";
import { getPreviousValidCalculatedValues, isUserDeleted, parseDate } from "./helpers";

const verifyAvailableThisYear = (
  meterReading: MeterReading,
  pumpingLimitThisYear: number | undefined,
  meterReadings: MeterReading[],
  index: number,
): CalculatedValue | undefined => {
  let shouldBe: number | undefined = undefined
  const { availableThisYear } = meterReading
  const { pumpedThisPeriod } = meterReading
  const {
    prevAvailableThisYear
  } = getPreviousValidCalculatedValues(meterReading, index, meterReadings)


  // Calc Case 1
  const currentFlowMeter = meterReading.flowMeter?.value
  const lastFlowMeterLastYear = meterReadings.filter(el => {
    const test1 = parseDate(el.date).year - 1
    const test2 = parseDate(meterReading.date).year
    const test = test1 === test2
    return test

  }
  )[0]?.flowMeter?.value
  const pumpedYearToDate = meterReading.pumpedYearToDate?.value
  const sumPumpedThisPeriod = meterReadings.filter(el =>
    parseDate(el.date).year === parseDate(meterReading.date).year
  ).map(el => el.pumpedThisPeriod?.value).filter(el => typeof el === 'number')


  if (
    typeof pumpingLimitThisYear === 'number' &&
    typeof currentFlowMeter === 'number' &&
    typeof lastFlowMeterLastYear === 'number'
  ) {
    shouldBe = pumpingLimitThisYear - (currentFlowMeter - lastFlowMeterLastYear)

  } else if (
    typeof pumpingLimitThisYear === 'number' &&
    typeof pumpedYearToDate === 'number'
  ) {
    shouldBe = pumpingLimitThisYear - pumpedYearToDate

  } else if (
    typeof pumpingLimitThisYear === 'number'
  ) {

  }




  // if (prevAvailableThisYear === undefined && meterReading.availableThisYear?.value !== undefined) {
  //   prevValue = { value: meterReading.availableThisYear.value }
  // }
  //


  if (isUserDeleted(availableThisYear)) return meterReading.availableThisYear
  if (isUserDeleted(pumpedYearToDate)) return
  if (isUserDeleted(pumpedThisPeriod)) return
  if (isUserDeleted(prevAvailableThisYear)) return

  if (meterReading.pumpedYearToDate?.value === undefined) {
    if (meterReading.availableThisYear?.source === 'user') {
      return {
        ...meterReading.availableThisYear,
      }
    }
    else {
      return
    }
  }

  shouldBe =
    pumpingLimitThisYear
      ? parseFloat((pumpingLimitThisYear - pumpedYearToDate?.value).toFixed(2))
      : parseFloat(
        ((prevAvailableThisYear?.value ?? 0) - (pumpedThisPeriod?.value ?? 0)).toFixed(2)
      )

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

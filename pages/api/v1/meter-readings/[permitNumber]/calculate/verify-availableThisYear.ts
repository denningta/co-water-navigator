import MeterReading, { CalculatedValue } from "../../../../../../interfaces/MeterReading";

const verifyAvailableThisYear = (
  meterReading: MeterReading,
  pumpingLimitThisYear: number | undefined,
  meterReadings: MeterReading[],
  index: number,
): CalculatedValue | undefined => {

  let prevValue: CalculatedValue | undefined = undefined

  for (let i = index - 1; i >= 0; i--) {
    if (meterReadings[i].availableThisYear) {
      prevValue = meterReadings[i].availableThisYear
      break
    }
  }

  if (!prevValue && meterReading.availableThisYear?.value !== undefined) prevValue = { value: meterReading.availableThisYear.value }

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

  const shouldBe =
    pumpingLimitThisYear
      ? parseFloat((pumpingLimitThisYear - meterReading.pumpedYearToDate.value).toFixed(2))
      : parseFloat(
        ((prevValue?.value ?? 0) - (meterReading.pumpedThisPeriod?.value ?? 0)).toFixed(2)
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

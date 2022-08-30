import MeterReading, { CalculatedValue } from "../../../../../../interfaces/MeterReading";

const verifyAvailableThisYear = (
  meterReading: MeterReading, 
  pumpingLimitThisYear: number,
  index: number,
): CalculatedValue | 'no update required' | 'delete me' => {
  if (index === 0) return 'no update required'
  if (!meterReading.flowMeter) return 'delete me'

  if (!meterReading.pumpedYearToDate) return 'no update required'

  const shouldBe = pumpingLimitThisYear - meterReading.pumpedYearToDate.value

  if (!meterReading.availableThisYear) {
    return {
      value: shouldBe
    }
  }

  const updatedValue: CalculatedValue = {
    ...meterReading.availableThisYear
  }

  if (meterReading.availableThisYear.value !== shouldBe) {
    updatedValue.shouldBe = shouldBe
    updatedValue.calculationState = 'warning'
    updatedValue.calculationMessage = `Expected: ${shouldBe} acre feet.  Provide a comment to resolve this warning.`
  } else {
    delete updatedValue.shouldBe
    delete updatedValue.calculationState
    delete updatedValue.calculationMessage
  }

  if (
    meterReading.availableThisYear.calculationMessage === updatedValue.calculationMessage
    && meterReading.availableThisYear.calculationState === updatedValue.calculationState
    && meterReading.availableThisYear.shouldBe === updatedValue.shouldBe
  ) return 'no update required'

  return updatedValue
}

export default verifyAvailableThisYear
import { GiReturnArrow } from "react-icons/gi";
import MeterReading, { CalculatedValue } from "../../../../../../interfaces/MeterReading";

const verifyAvailableThisYear = (
  meterReading: MeterReading, 
  pumpingLimitThisYear: number,
  index: number,
): CalculatedValue | undefined => {
  if (index === 0) return
  if (!meterReading.flowMeter) return
  if (!meterReading.pumpedYearToDate) return
  const shouldBe = pumpingLimitThisYear - meterReading.pumpedYearToDate.value

  const updatedValue: CalculatedValue = {
    ...meterReading.availableThisYear,
    value: shouldBe
  }

  if (meterReading.availableThisYear?.source === 'user') {
    updatedValue.value = meterReading.availableThisYear.value
      if (meterReading.availableThisYear.value !== shouldBe) {
        updatedValue.shouldBe = shouldBe
        updatedValue.calculationState = 'warning'
        updatedValue.calculationMessage = `Expected: ${shouldBe} acre feet.  Provide a comment to resolve this warning.`
      } else {
        delete updatedValue.shouldBe
        delete updatedValue.calculationState
        delete updatedValue.calculationMessage
        delete updatedValue.source
      }
  }
  
  return updatedValue
}

export default verifyAvailableThisYear
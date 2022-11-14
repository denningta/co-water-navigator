import { GiReturnArrow } from "react-icons/gi";
import MeterReading, { CalculatedValue } from "../../../../../../interfaces/MeterReading";
import { getPrecision } from "./helpers";

const verifyAvailableThisYear = (
  meterReading: MeterReading, 
  pumpingLimitThisYear: number | undefined,
  prevRecord: MeterReading,
  index: number,
): CalculatedValue | undefined => {

  if (
    !prevRecord 
    || prevRecord.availableThisYear?.value === undefined
    || meterReading.pumpedYearToDate?.value === undefined
  ) {
    if (meterReading.availableThisYear?.source === 'user')
      return meterReading.availableThisYear
    else
      return
  }

  const shouldBe = 
    pumpingLimitThisYear 
    ? parseFloat((pumpingLimitThisYear - meterReading.pumpedYearToDate.value).toFixed(2))
    : parseFloat(
      (prevRecord.availableThisYear.value - (meterReading.pumpedThisPeriod?.value ?? 0)).toFixed(2)
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
      delete updatedValue.source
    }
  }

  return updatedValue
}

export default verifyAvailableThisYear
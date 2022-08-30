import { update } from "lodash";
import MeterReading, { CalculatedValue } from "../../../../../../interfaces/MeterReading";

const verifyPumpedThisPeriod = (
  meterReading: MeterReading, 
  prevRecord: MeterReading, 
  index: number
): CalculatedValue | 'no update required' | 'delete me' => {
  if (index === 0) return 'no update required'
  if (!meterReading) return 'no update required'
  if (!meterReading.flowMeter) return 'delete me'
  if (!prevRecord || !prevRecord.flowMeter) return 'no update required'

  const shouldBe = meterReading.flowMeter.value - prevRecord.flowMeter.value;

  const updatedValue: CalculatedValue = {
    ...meterReading.pumpedThisPeriod,
    value: shouldBe,
  }

  if (meterReading.pumpedThisPeriod?.value === updatedValue.value) return 'no update required'

  // if (!meterReading.pumpedThisPeriod) {
  //   return {
  //     value: shouldBe
  //   }
  // }

  // if (meterReading.pumpedThisPeriod.value !== shouldBe) {
  //   updatedValue.value = shouldBe
  //   updatedValue.shouldBe = shouldBe
  //   updatedValue.calculationState = 'warning'
  //   updatedValue.calculationMessage = `Expected: ${shouldBe} acre feet.  Provide a comment to resolve this warning.`
  // } else {
  //   delete updatedValue.shouldBe
  //   delete updatedValue.calculationState
  //   delete updatedValue.calculationMessage
  //   delete updatedValue.source
  // }



  // if (
  //   meterReading.pumpedThisPeriod.calculationMessage === updatedValue.calculationMessage
  //   && meterReading.pumpedThisPeriod.calculationState === updatedValue.calculationState
  //   && meterReading.pumpedThisPeriod.shouldBe === updatedValue.shouldBe
  // ) return 'no update required'

  return updatedValue;
}

export default verifyPumpedThisPeriod;

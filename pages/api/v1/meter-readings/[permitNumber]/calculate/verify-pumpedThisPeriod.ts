import { update } from "lodash";
import MeterReading, { CalculatedValue } from "../../../../../../interfaces/MeterReading";

const verifyPumpedThisPeriod = (
  meterReading: MeterReading, 
  prevRecord: MeterReading, 
  index: number
): CalculatedValue | undefined => {
  if (index === 0) return
  if (!meterReading || !meterReading.flowMeter) return
  if (!prevRecord || !prevRecord.flowMeter) return

  const shouldBe = meterReading.flowMeter.value - prevRecord.flowMeter.value;

  const updatedValue: CalculatedValue = {
    ...meterReading.pumpedThisPeriod,
    value: shouldBe,
  }

  if (meterReading.pumpedThisPeriod?.source === 'user') {
    updatedValue.value = meterReading.pumpedThisPeriod.value
      if (meterReading.pumpedThisPeriod.value !== shouldBe) {
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

  // if (meterReading.pumpedThisPeriod?.value === updatedValue.value) return

  return updatedValue;

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
  // ) return


}

export default verifyPumpedThisPeriod;

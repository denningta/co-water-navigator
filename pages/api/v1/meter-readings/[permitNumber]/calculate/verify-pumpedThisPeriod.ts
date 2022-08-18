import MeterReading, { CalculatedValue } from "../../../../../../interfaces/MeterReading";

const verifyPumpedThisPeriod = (
  meterReading: MeterReading, 
  prevRecord: MeterReading, 
  index: number
): CalculatedValue | 'no update required' => {
  if (!meterReading || index === 0) return 'no update required'
  if (!meterReading.flowMeter || !prevRecord.flowMeter) return 'no update required'

  const shouldBe = meterReading.flowMeter.value - prevRecord.flowMeter.value;

  if (!meterReading.pumpedThisPeriod) {
    return {
      value: shouldBe
    }
  }

  const updatedValue: CalculatedValue = {
    ...meterReading.pumpedThisPeriod
  }

  if (meterReading.pumpedThisPeriod.value !== shouldBe) {
    updatedValue.shouldBe = shouldBe
    updatedValue.calculationState = 'warning'
    updatedValue.calculationMessage = `Expected: ${shouldBe} acre feet.  Provide a comment to resolve this warning.`
  } else {
    delete updatedValue.shouldBe
    delete updatedValue.calculationState
    delete updatedValue.calculationMessage
  }


  if (
    meterReading.pumpedThisPeriod.calculationMessage === updatedValue.calculationMessage
    && meterReading.pumpedThisPeriod.calculationState === updatedValue.calculationState
    && meterReading.pumpedThisPeriod.shouldBe === updatedValue.shouldBe
  ) return 'no update required'

  return updatedValue;
}

export default verifyPumpedThisPeriod;

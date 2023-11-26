import MeterReading, { CalculatedValue } from "../../../../../../interfaces/MeterReading";
import { getPreviousValidCalculatedValues } from "./helpers";

const verifyEqualToPrevValue = (
  meterReading: MeterReading,
  meterReadings: MeterReading[],
  index: number,
  property: keyof Pick<MeterReading, 'powerConsumptionCoef'>
): CalculatedValue | undefined => {

  const calculatedValue: CalculatedValue | undefined = meterReading[property];
  let prevValue: CalculatedValue | undefined = undefined

  const {
    prevPowerConsumptionCoef
  } = getPreviousValidCalculatedValues(meterReading, index, meterReadings)

  prevValue = prevPowerConsumptionCoef

  if (index === 0) return calculatedValue
  if (!calculatedValue || !calculatedValue.value) return
  if (!prevValue || prevValue.value === undefined) prevValue = { value: calculatedValue.value }

  if (calculatedValue.source === 'user-deleted') {
    return {
      value: 'user-deleted',
      source: 'user-deleted'
    }
  }

  const updatedValue: CalculatedValue = {
    ...calculatedValue
  }

  if (!(+calculatedValue.value === +prevValue.value)) {
    updatedValue.calculationState = 'warning'
    updatedValue.shouldBe = prevValue.value as number;
    updatedValue.calculationMessage = `Expected: ${prevValue.value}. ` +
      `The power consumption coefficient should remain constant unless the power meter was changed. ` +
      `Provide a comment to resolve this warning`;
    if (meterReading.comments) {
      updatedValue.calculationMessage = `Unexpected value: see comments`;
    }
  } else {
    delete updatedValue.calculationState
    delete updatedValue.calculationMessage
  }

  return updatedValue;
}

export default verifyEqualToPrevValue;

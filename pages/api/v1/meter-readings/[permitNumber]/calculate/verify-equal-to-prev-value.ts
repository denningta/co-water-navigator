import MeterReading, { CalculatedValue } from "../../../../../../interfaces/MeterReading";

const verifyEqualToPrevValue = (
  meterReading: MeterReading, 
  meterReadings: MeterReading[], 
  index: number,
  property: keyof Pick<MeterReading, 'powerConsumptionCoef'>
): CalculatedValue | undefined => {

  const calculatedValue: CalculatedValue | undefined = meterReading[property];
  let prevValue: CalculatedValue | undefined = undefined

  for (let i = index - 1; i >= 0; i--) {
    if (meterReadings[i][property]) {
      prevValue = meterReadings[i][property]
      break
    }
  }
  
  if (index === 0) return calculatedValue
  if (!calculatedValue || !calculatedValue.value) return
  if (!prevValue || prevValue.value === undefined) prevValue = { value: calculatedValue.value }

  const updatedValue: CalculatedValue = {
    ...calculatedValue
  }

  if (!(+calculatedValue.value === +prevValue.value)) {
    updatedValue.calculationState = 'warning'
    updatedValue.shouldBe = prevValue.value;
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
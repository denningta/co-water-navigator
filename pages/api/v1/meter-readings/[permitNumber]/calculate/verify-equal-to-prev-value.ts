import MeterReading, { CalculatedValue } from "../../../../../../interfaces/MeterReading";

const verifyEqualToPrevValue = (
  meterReading: MeterReading, 
  prevRecord: MeterReading, 
  index: number,
  property: keyof Pick<MeterReading, 'powerConsumptionCoef'>
): CalculatedValue | 'no update required' => {

  const calculatedValue: CalculatedValue | undefined = meterReading[property];
  const prevValue: CalculatedValue | undefined = prevRecord ? prevRecord[property] : undefined;
  
  if (!calculatedValue || index === 0 || !calculatedValue.value) return 'no update required';
  if (!prevValue || !prevValue.value) return 'no update required';

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

  // Is this old news and we dont need to make an update?
  if (
    calculatedValue.calculationState === updatedValue.calculationState &&
    calculatedValue.calculationMessage === updatedValue.calculationMessage
  ) return 'no update required';

  return updatedValue;
}

export default verifyEqualToPrevValue;
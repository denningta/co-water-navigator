import MeterReading, { CalculatedValue } from "../../../../../../interfaces/MeterReading"

const verifyGreaterThanPrevValue = (
  meterReading: MeterReading, 
  prevRecord: MeterReading, 
  index: number,
  property: keyof Pick<MeterReading, 'flowMeter' | 'powerMeter'>
): CalculatedValue | undefined => {

  const calculatedValue: CalculatedValue | undefined = meterReading[property]
  const prevValue: CalculatedValue | undefined = prevRecord ? prevRecord[property] : undefined
  
  if (index === 0) return calculatedValue
  if (!calculatedValue || !calculatedValue.value) return
  if (!prevValue || !prevValue.value) return

  const updatedValue: CalculatedValue = {
    ...calculatedValue
  }

  if (!(+calculatedValue.value >= +prevValue.value))  {
    updatedValue.calculationState = 'warning'
    updatedValue.calculationMessage = `Expected a value >= ${prevValue.value} acre feet. ` + 
      `Provide a comment to resolve this warning`
    if (meterReading.comments) {
      updatedValue.calculationMessage = `Unexpected value: see comments`
    }
  } else {
    delete updatedValue.calculationState
    delete updatedValue.calculationMessage
  }

  return updatedValue
}

export default verifyGreaterThanPrevValue
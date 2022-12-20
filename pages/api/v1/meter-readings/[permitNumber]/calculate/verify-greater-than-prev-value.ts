import MeterReading, { CalculatedValue } from "../../../../../../interfaces/MeterReading"

const verifyGreaterThanPrevValue = (
  meterReading: MeterReading, 
  meterReadings: MeterReading[],
  index: number,
  property: keyof Pick<MeterReading, 'flowMeter' | 'powerMeter'>
): CalculatedValue | undefined => {

  const calculatedValue: CalculatedValue | undefined = meterReading[property]
  let prevValue: CalculatedValue | undefined = undefined

  for (let i = index - 1; i >= 0; i--) {
    if (meterReadings[i][property]) {
      prevValue = meterReadings[i][property]
      break
    }
  }
  
  if (index === 0) return calculatedValue
  if (!calculatedValue || calculatedValue.value === undefined) return
  if (!prevValue || prevValue.value === undefined) prevValue = { value: 0 }

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
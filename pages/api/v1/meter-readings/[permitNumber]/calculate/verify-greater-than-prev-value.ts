import { CalculatedField } from "."
import MeterReading, { CalculatedValue } from "../../../../../../interfaces/MeterReading"
import { getPreviousValidCalculatedValues } from "./helpers"

const verifyGreaterThanPrevValue = (
  meterReading: MeterReading,
  meterReadings: MeterReading[],
  index: number,
  property: CalculatedField
): CalculatedValue | undefined => {
  const calculatedValue: CalculatedValue | undefined = meterReading[property]
  let prevValue: CalculatedValue | undefined = undefined

  const {
    prevFlowMeter,
    prevPowerMeter
  } = getPreviousValidCalculatedValues(meterReading, index, meterReadings)

  prevValue = property === 'powerMeter' ? prevPowerMeter : prevFlowMeter

  if (index === 0) return calculatedValue
  if (!calculatedValue || calculatedValue.value === undefined) return
  if (!prevValue || prevValue.value === undefined) prevValue = { value: 0 }

  if (calculatedValue.source === 'user-deleted') {
    return {
      value: 'user-deleted',
      source: 'user-deleted'
    }
  }

  const updatedValue: CalculatedValue = {
    ...calculatedValue
  }

  if (!(+calculatedValue.value >= +prevValue.value)) {
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

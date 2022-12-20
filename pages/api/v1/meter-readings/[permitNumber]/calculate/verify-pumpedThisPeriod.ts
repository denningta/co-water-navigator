import _ from "lodash";
import { update } from "lodash";
import MeterReading, { CalculatedValue } from "../../../../../../interfaces/MeterReading";
import { getPrecision } from "./helpers";

const verifyPumpedThisPeriod = (
  meterReading: MeterReading, 
  meterReadings: MeterReading[], 
  index: number
): CalculatedValue | undefined => {

  let prevValue: CalculatedValue | undefined = undefined

  for (let i = index - 1; i >= 0; i--) {
    if (meterReadings[i].flowMeter) {
      prevValue = meterReadings[i].flowMeter
      break
    }
  }

  if (!prevValue) prevValue = { value: meterReading.flowMeter?.value ?? 0 }

  if (
    meterReading.flowMeter?.value === undefined
  ) {
    if (meterReading.pumpedThisPeriod?.source === 'user') 
      return meterReading.pumpedThisPeriod
    else 
      return
  }

  const shouldBe = parseFloat((meterReading.flowMeter.value - prevValue.value).toFixed(2))

  const updatedValue: CalculatedValue = { 
    ...meterReading.pumpedThisPeriod, 
    value: shouldBe
  }

  if (meterReading.pumpedThisPeriod?.source === 'user') {
    updatedValue.value = meterReading.pumpedThisPeriod.value
    if (meterReading.pumpedThisPeriod.value !== shouldBe) {
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

export default verifyPumpedThisPeriod;

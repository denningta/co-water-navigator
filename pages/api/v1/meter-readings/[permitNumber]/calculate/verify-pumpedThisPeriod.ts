import MeterReading, { CalculatedValue } from "../../../../../../interfaces/MeterReading";
import { getPreviousValidCalculatedValues } from "./helpers";

const verifyPumpedThisPeriod = (
  meterReading: MeterReading,
  meterReadings: MeterReading[],
  index: number
): CalculatedValue | undefined => {

  const {
    prevFlowMeter,
    prevPowerMeter
  } = getPreviousValidCalculatedValues(meterReading, index, meterReadings)

  const {
    flowMeter,
    powerMeter,
    powerConsumptionCoef,
    pumpedThisPeriod
  } = meterReading

  const flowMeterValue = flowMeter?.value
  const powerMeterValue = powerMeter?.value as number | undefined
  const powerConsumptionCoefValue = powerConsumptionCoef?.value as number | undefined
  const prevFlowMeterValue = prevFlowMeter?.value as number | undefined
  const prevPowerMeterValue = prevPowerMeter?.value as number | undefined
  let flowMeterShouldBe = undefined
  let powerMeterShouldBe = undefined

  if (flowMeterValue === undefined && powerMeterValue == undefined) return undefined
  if (flowMeterValue === 'user-deleted') return


  if (flowMeterValue !== undefined) {
    flowMeterShouldBe = parseFloat((flowMeterValue - (prevFlowMeterValue ?? 0)).toFixed(2))
  }

  if (powerMeterValue !== undefined && powerConsumptionCoefValue !== undefined && prevPowerMeterValue !== undefined) {
    powerMeterShouldBe = parseFloat(((powerMeterValue - prevPowerMeterValue) * powerConsumptionCoefValue).toFixed((2)))
  }

  if (flowMeterShouldBe === undefined && powerMeterShouldBe === undefined) return

  const shouldBe = flowMeterShouldBe ? flowMeterShouldBe : powerMeterShouldBe as number

  const updatedValue: CalculatedValue = {
    ...meterReading.pumpedThisPeriod,
    value: shouldBe
  }

  if (powerMeterShouldBe && flowMeterShouldBe) {
    const percent = withinPercent(flowMeterShouldBe, powerMeterShouldBe)

    if (percent < 93) {
      updatedValue.value = shouldBe
      updatedValue.shouldBe = shouldBe
      updatedValue.calculationState = 'warning'
      updatedValue.calculationMessage = `Flow meter outside tolerance range`
    }

    if (percent >= 93 && percent < 97) {
      updatedValue.shouldBe = shouldBe
      updatedValue.calculationState = 'warning'
      updatedValue.calculationMessage = `Flow meter calibration required`
    }

    if (percent > 97) {
      delete updatedValue.shouldBe
      delete updatedValue.calculationState
      delete updatedValue.calculationMessage
    }
  }

  if (pumpedThisPeriod?.source === 'user') {
    updatedValue.value = pumpedThisPeriod.value
    if (pumpedThisPeriod.value !== shouldBe) {
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


function withinPercent(value: number, target: number) {
  if (target === value) return 100

  const percent = target > value
    ? (value / target) * 100
    : (target / value) * 100
  return Math.round(percent * 100) / 100
}

export default verifyPumpedThisPeriod;

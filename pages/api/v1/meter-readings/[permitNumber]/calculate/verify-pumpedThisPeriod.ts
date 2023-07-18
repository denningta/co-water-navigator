import MeterReading, { CalculatedValue } from "../../../../../../interfaces/MeterReading";

const verifyPumpedThisPeriod = (
  meterReading: MeterReading,
  meterReadings: MeterReading[],
  index: number
): CalculatedValue | undefined => {
  let prevValue: CalculatedValue | undefined = undefined
  let prevPowerMeter: CalculatedValue | undefined = undefined

  for (let i = index - 1; i >= 0; i--) {
    if (meterReadings[i].flowMeter) {
      prevValue = meterReadings[i].flowMeter
      break
    }
  }

  for (let i = index - 1; i >= 0; i--) {
    if (meterReadings[i].powerMeter) {
      prevPowerMeter = meterReadings[i].powerMeter
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

  let shouldBePowerMeterCalc = undefined

  if (meterReading.powerMeter?.value && meterReading.powerConsumptionCoef?.value && prevPowerMeter?.value) {
    shouldBePowerMeterCalc = parseFloat(((meterReading.powerMeter.value - prevPowerMeter.value) * meterReading.powerConsumptionCoef.value).toFixed((2)))
    const percent = withinPercent(shouldBe, shouldBePowerMeterCalc)

    if (percent < 93) {
      updatedValue.value = shouldBePowerMeterCalc
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


function withinPercent(value: number, target: number) {
  if (target === value) return 100

  const percent = target > value
    ? (value / target) * 100
    : (target / value) * 100
  return Math.round(percent * 100) / 100
}

export default verifyPumpedThisPeriod;

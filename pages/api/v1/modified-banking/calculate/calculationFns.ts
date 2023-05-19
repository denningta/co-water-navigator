import { CalculatedValue } from "../../../../../interfaces/MeterReading";
import { ModifiedBanking, ModifiedBankingCalculatedFields } from "../../../../../interfaces/ModifiedBanking";

export interface CalculationProps {
  data: ModifiedBanking
  dataLastYear: ModifiedBanking | undefined
  bankingReserveLastYear: number | undefined
  totalPumpedThisYear: number | undefined
}

type CalculationFn = (props: CalculationProps) => CalculatedValue | undefined

type CalculationFns = {
  [key in ModifiedBankingCalculatedFields]: CalculationFn;
};


const abstractCalculationFn = (
  field: ModifiedBankingCalculatedFields,
  data: ModifiedBanking,
  shouldBe: number
): CalculatedValue | undefined => {
  const updatedValue = {
    ...data[field],
    value: +shouldBe.toFixed(2)
  }
  if (data[field]?.source === 'user') {
    const userVal = data[field]
    if (!userVal) return
    updatedValue.value = userVal.value
    if (userVal.value !== shouldBe) {
      updatedValue.shouldBe = shouldBe
      updatedValue.calculationState = 'warning'
      updatedValue.calculationMessage = `Expected: ${shouldBe}`
    } else {
      delete updatedValue.shouldBe
      delete updatedValue.calculationState
      delete updatedValue.calculationMessage
      delete updatedValue.source
    }
  }
  return updatedValue
}

const calculationFns: CalculationFns = {
  originalAppropriation: ({ data, dataLastYear }) => {
    if (!dataLastYear) {
      if (!data.originalAppropriation) return
      return { value: data.originalAppropriation.value }
    }
    if (!dataLastYear.originalAppropriation) return
    const shouldBe = dataLastYear.originalAppropriation.value
    const update = abstractCalculationFn('originalAppropriation', data, shouldBe)
    return update
  },

  allowedAppropriation: ({ data, dataLastYear }) => {
    if (!dataLastYear) {
      if (!data.allowedAppropriation) return
      return { value: data.allowedAppropriation.value }
    }
    if (!dataLastYear.allowedAppropriation) return
    const shouldBe = dataLastYear.allowedAppropriation.value
    return abstractCalculationFn('allowedAppropriation', data, shouldBe)
  },

  line3: ({ data }) => {
    if (!data.allowedAppropriation || !data.originalAppropriation) return
    const shouldBe = data.originalAppropriation.value - data.allowedAppropriation.value
    return abstractCalculationFn('line3', data, shouldBe)
  },

  maxBankingReserve: ({ data }) => {
    if (!data.allowedAppropriation || !data.originalAppropriation) return
    const shouldBe = 3 * (data.originalAppropriation.value - data.allowedAppropriation.value)
    return abstractCalculationFn('maxBankingReserve', data, shouldBe)
  },

  bankingReserveLastYear: ({ data, bankingReserveLastYear }) => {
    if (!bankingReserveLastYear) {
      if (data.bankingReserveLastYear) return data.bankingReserveLastYear
      return
    }
    const shouldBe = bankingReserveLastYear
    return abstractCalculationFn('bankingReserveLastYear', data, shouldBe)
  },

  pumpingLimitThisYear: ({ data }) => {
    if (
      !data.originalAppropriation
      || !data.allowedAppropriation
      || !data.bankingReserveLastYear
    ) return
    let shouldBe
    if (data.line6Option === 'a') {
      shouldBe = data.allowedAppropriation.value
    } else {
      shouldBe = Math.min(
        data.originalAppropriation.value,
        data.allowedAppropriation.value + data.bankingReserveLastYear.value
      )
    }
    return abstractCalculationFn('pumpingLimitThisYear', data, shouldBe)
  },

  totalPumpedThisYear: ({ data, totalPumpedThisYear }) => {
    if (!totalPumpedThisYear && !data.totalPumpedThisYear?.value === undefined) return
    if (totalPumpedThisYear)
      return abstractCalculationFn('totalPumpedThisYear', data, totalPumpedThisYear)
    if (data.totalPumpedThisYear?.value !== undefined)
      return abstractCalculationFn('totalPumpedThisYear', data, data.totalPumpedThisYear.value)
  },

  changeInBankingReserveThisYear: ({ data }) => {
    if (!data.allowedAppropriation || !data.totalPumpedThisYear) return
    const shouldBe = data.allowedAppropriation.value - data.totalPumpedThisYear.value
    return abstractCalculationFn('changeInBankingReserveThisYear', data, shouldBe)
  },

  bankingReserveThisYear: ({ data }) => {
    if (
      !data.maxBankingReserve
      || !data.bankingReserveLastYear
      || !data.changeInBankingReserveThisYear
    ) return
    const shouldBe = Math.min(
      data.maxBankingReserve.value,
      data.bankingReserveLastYear.value + data.changeInBankingReserveThisYear.value
    )
    return abstractCalculationFn('bankingReserveThisYear', data, shouldBe)
  },

  line10: ({ data }) => {
    if (!data.allowedAppropriation || !data.bankingReserveThisYear) return
    const shouldBe = data.allowedAppropriation.value + data.bankingReserveThisYear.value
    return abstractCalculationFn('line10', data, shouldBe)
  },

  pumpingLimitNextYear: ({ data }) => {
    if (!data.originalAppropriation || !data.line10) return
    const shouldBe = Math.min(data.originalAppropriation.value, data.line10.value)
    return abstractCalculationFn('pumpingLimitNextYear', data, shouldBe)
  },

}

export default calculationFns

import { CalculatedValue } from "../../../../../../../interfaces/MeterReading"
import { ModifiedBanking, ModifiedBankingCalculatedFields } from "../../../../../../../interfaces/ModifiedBanking"

export interface CalculationProps {
  data: ModifiedBanking
  dataLastYear?: ModifiedBanking
  bankingReserveLastYear?: number
  totalPumpedThisYear?: number
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
    updatedValue.value = userVal.value as number
    if (userVal.value !== shouldBe) {
      updatedValue.shouldBe = shouldBe
      updatedValue.calculationState = 'warning'
      updatedValue.calculationMessage = `Expected: ${shouldBe}`
    } else {
      delete updatedValue.shouldBe
      delete updatedValue.calculationState
      delete updatedValue.calculationMessage
    }
  }

  return updatedValue
}

const calculationFns: CalculationFns = {
  originalAppropriation: ({ data, dataLastYear }) => {
    const { originalAppropriation } = data

    let shouldBe: number | undefined = originalAppropriation?.value as number

    if (dataLastYear?.originalAppropriation) {
      shouldBe = dataLastYear.originalAppropriation.value as number
    }

    if (!isDefined(shouldBe)) return

    return abstractCalculationFn('originalAppropriation', data, shouldBe as number)
  },

  allowedAppropriation: ({ data, dataLastYear }) => {
    const { allowedAppropriation } = data

    let shouldBe: number | undefined = allowedAppropriation?.value as number

    if (dataLastYear?.allowedAppropriation) {
      shouldBe = dataLastYear.allowedAppropriation.value as number
    }

    if (!isDefined(shouldBe)) return

    return abstractCalculationFn('allowedAppropriation', data, shouldBe as number)
  },

  line3: ({ data }) => {
    const { allowedAppropriation, originalAppropriation, line3 } = data
    if (allowedAppropriation?.value === 'user-deleted') return
    if (originalAppropriation?.value === 'user-deleted') return

    let shouldBe: number | undefined = line3?.value as number

    if (allowedAppropriation?.value && originalAppropriation?.value) {
      shouldBe = originalAppropriation.value - allowedAppropriation.value
    }

    if (!isDefined(shouldBe)) return

    return abstractCalculationFn('line3', data, shouldBe)
  },

  maxBankingReserve: ({ data }) => {
    const { allowedAppropriation, originalAppropriation, maxBankingReserve, line3 } = data
    if (allowedAppropriation?.value === 'user-deleted') return
    if (originalAppropriation?.value === 'user-deleted') return
    if (line3?.value === 'user-deleted') return

    let shouldBe: number | undefined = maxBankingReserve?.value as number

    if (allowedAppropriation && originalAppropriation) {
      shouldBe = (originalAppropriation.value - allowedAppropriation.value) * 3
    } else if (line3) {
      shouldBe = line3.value * 3
    }

    if (!isDefined(shouldBe)) return

    return abstractCalculationFn('maxBankingReserve', data, shouldBe)
  },

  bankingReserveLastYear: ({ data, bankingReserveLastYear }) => {
    let shouldBe: number | undefined = data?.bankingReserveLastYear?.value as number

    if (isDefined(bankingReserveLastYear)) {
      shouldBe = bankingReserveLastYear
    }

    if (!isDefined(shouldBe)) return

    return abstractCalculationFn('bankingReserveLastYear', data, shouldBe as number)
  },

  pumpingLimitThisYear: ({ data }) => {
    const {
      pumpingLimitThisYear,
      originalAppropriation,
      allowedAppropriation,
      bankingReserveLastYear,
      line6Option
    } = data
    if (allowedAppropriation?.value === 'user-deleted') return
    if (originalAppropriation?.value === 'user-deleted') return
    if (bankingReserveLastYear?.value === 'user-deleted') return

    let shouldBe: number | undefined = pumpingLimitThisYear?.value as number

    if (
      allowedAppropriation && originalAppropriation && bankingReserveLastYear
    ) {
      shouldBe = line6Option === 'a'
        ? allowedAppropriation.value
        : Math.min(
          originalAppropriation.value as number,
          allowedAppropriation.value + bankingReserveLastYear.value
        )
    }

    if (!isDefined(shouldBe)) return

    return abstractCalculationFn('pumpingLimitThisYear', data, shouldBe as number)
  },

  totalPumpedThisYear: ({ data, totalPumpedThisYear }) => {
    let shouldBe: number | undefined = data?.totalPumpedThisYear?.value as number

    if (isDefined(totalPumpedThisYear)) {
      shouldBe = totalPumpedThisYear
    }

    if (!isDefined(shouldBe)) return

    return abstractCalculationFn('totalPumpedThisYear', data, shouldBe as number)
  },

  changeInBankingReserveThisYear: ({ data }) => {
    const { changeInBankingReserveThisYear, allowedAppropriation, totalPumpedThisYear } = data
    if (allowedAppropriation?.value === 'user-deleted') return
    if (changeInBankingReserveThisYear?.value === 'user-deleted') return
    if (totalPumpedThisYear?.value === 'user-deleted') return


    let shouldBe: number | undefined = changeInBankingReserveThisYear?.value as number

    if (allowedAppropriation && totalPumpedThisYear) {
      shouldBe = allowedAppropriation.value - totalPumpedThisYear.value
    }

    if (!isDefined(shouldBe)) return

    return abstractCalculationFn('changeInBankingReserveThisYear', data, shouldBe as number)
  },

  bankingReserveThisYear: ({ data }) => {
    const {
      bankingReserveThisYear,
      maxBankingReserve,
      bankingReserveLastYear,
      changeInBankingReserveThisYear
    } = data

    if (bankingReserveThisYear?.value === 'user-deleted') return
    if (bankingReserveLastYear?.value === 'user-deleted') return
    if (maxBankingReserve?.value === 'user-deleted') return
    if (changeInBankingReserveThisYear?.value === 'user-deleted') return

    let shouldBe: number | undefined = bankingReserveThisYear?.value

    if (
      maxBankingReserve
      && bankingReserveLastYear
      && changeInBankingReserveThisYear
    ) {
      shouldBe = Math.min(
        maxBankingReserve.value,
        bankingReserveLastYear.value + changeInBankingReserveThisYear.value
      )
    } else if (maxBankingReserve) {
      shouldBe = maxBankingReserve.value
    } else if (bankingReserveLastYear && changeInBankingReserveThisYear) {
      shouldBe = bankingReserveLastYear.value + changeInBankingReserveThisYear.value
    }

    if (!isDefined(shouldBe)) return

    return abstractCalculationFn('bankingReserveThisYear', data, shouldBe as number)
  },

  line10: ({ data }) => {
    const { line10, allowedAppropriation, bankingReserveThisYear } = data
    if (line10?.value === 'user-deleted') return
    if (allowedAppropriation?.value === 'user-deleted') return
    if (bankingReserveThisYear?.value === 'user-deleted') return

    let shouldBe: number | undefined = line10?.value

    if (allowedAppropriation && bankingReserveThisYear) {
      shouldBe = allowedAppropriation.value + bankingReserveThisYear.value
    }

    if (!isDefined(shouldBe)) return

    return abstractCalculationFn('line10', data, shouldBe as number)
  },

  pumpingLimitNextYear: ({ data }) => {
    const { pumpingLimitNextYear, originalAppropriation, line10 } = data
    if (pumpingLimitNextYear?.value === 'user-deleted') return
    if (originalAppropriation?.value === 'user-deleted') return
    if (line10?.value === 'user-deleted') return

    let shouldBe: number | undefined = pumpingLimitNextYear?.value

    if (originalAppropriation && line10) {
      shouldBe = Math.min(originalAppropriation.value, line10.value)
    } else if (originalAppropriation) {
      shouldBe = originalAppropriation.value
    } else if (line10) {
      shouldBe = line10.value
    }

    if (!isDefined(shouldBe)) return

    return abstractCalculationFn('pumpingLimitNextYear', data, shouldBe as number)
  },

}

const isDefined = (number: number | undefined): boolean => {
  if (typeof number === 'undefined' || number === null) {
    return false
  }
  return true
}

export default calculationFns

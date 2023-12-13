import { CalculatedValue } from "../../../../../../interfaces/MeterReading"
import { compareUserDefinitiontoCalculatedValue } from "../../../../../../pages/api/v1/data-summary/dbb004-banking-summary/list"

describe('listDbb004BankingSummary', () => {

  describe('compare user definition to calculated values', () => {

    test('user value defined, calc value defined, values match', () => {
      const user: CalculatedValue = { value: 170, source: 'user' }
      const calc: CalculatedValue = { value: 170 }

      const bankingSummary = compareUserDefinitiontoCalculatedValue(calc, user)

      expect(bankingSummary).toBe(user)
    })

    test('user value defined, calc value undefined', () => {
      const user: CalculatedValue = { value: 170, source: 'user' }
      const calc = undefined

      const bankingSummary = compareUserDefinitiontoCalculatedValue(calc, user)

      expect(bankingSummary).toBe(user)

    })

    test('user value undefined, calc value defined', () => {
      const user = undefined
      const calc: CalculatedValue = { value: 170 }

      const bankingSummary = compareUserDefinitiontoCalculatedValue(calc, user)

      expect(bankingSummary).toBe(calc)
    })

    test('user value defined, calc value defined, values do not match', () => {
      const user: CalculatedValue = { value: 170, source: 'user' }
      const calc: CalculatedValue = { value: 350 }

      const bankingSummary = compareUserDefinitiontoCalculatedValue(calc, user)

      expect(bankingSummary).toEqual(expect.objectContaining({
        ...user,
        shouldBe: calc.value,
      }))
      expect(bankingSummary).toHaveProperty('calculationState')
      expect(bankingSummary).toHaveProperty('calculationMessage')
    })

  })

})

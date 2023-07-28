import calculationFns, { CalculationProps } from "../../../../../../../../pages/api/v1/modified-banking/[permitNumber]/[year]/calculate/calculationFns"

describe('Modified banking calculation functions', () => {

  const fnKeys = Object.keys(calculationFns) as (keyof typeof calculationFns)[]

  fnKeys.forEach((key) => {
    describe('Return input value when dependencies are undefined', () => {
      it(key, () => {
        const props: CalculationProps = {
          data: {
            [key]: {
              value: 300,
              source: 'user'
            }
          }
        }

        const result = calculationFns[key](props)
        if (!result) throw new Error('result undefined')
        expect(result.value).toEqual(300)
        expect(result.source).toEqual('user')
      })
    })

    describe('return undefined if input is undefined', () => {
      it(key, () => {
        const props: CalculationProps = {
          data: {
            [key]: {
              value: undefined
            }
          }
        }

        const result = calculationFns[key](props)
        expect(result).toBeUndefined()
      })

    })

  })


  describe('return calculated value if dependencies exist', () => {
    it('originalAppropriation', () => {
      const props: CalculationProps = {
        data: {},
        dataLastYear: {
          originalAppropriation: {
            value: 300
          }
        }
      }

      const result = calculationFns['originalAppropriation'](props)
      if (!result) throw new Error('result undefined')
      expect(result.value).toEqual(300)
    })


  })



})

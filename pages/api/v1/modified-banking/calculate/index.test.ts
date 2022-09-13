/**
 * Tests meterReadings calculations
 * 
 * @group modified-banking
 * @group calculations
 */

import { calculate, queryDependencies } from "."
import { ModifiedBanking } from "../../../../../interfaces/ModifiedBanking"
import { CalculationProps } from "./calculationFns"

const header = {
  permitNumber: 'XX-00000',
  year: '1900'
}

describe('DBB-013 Calcuations', () => {

  test('Line 1: user defined value triggers error', () => {
    const dataLastYear: ModifiedBanking = {
      ...header,
      originalAppropriation: {
        value: 100
      },
    }

    const data: ModifiedBanking = {
      ...header,
      originalAppropriation: {
        value: 101,
        source: 'user'
      },
    }

    const props: CalculationProps = {
      data: data,
      dataLastYear: dataLastYear,
      bankingReserveLastYear: 10,
      totalPumpedThisYear: 20
    }

    const res = calculate(props)

    expect(res).toBeTruthy()
    expect(res?.originalAppropriation?.value).toBe(101)
    expect(res?.originalAppropriation?.shouldBe).toBe(100)
    expect(res?.originalAppropriation?.calculationState).toBe('warning')
  })

  test('retrieve dependencies', async () => {
    const res = await queryDependencies('XX-00000', '1900')
    console.log(res)
  })

})
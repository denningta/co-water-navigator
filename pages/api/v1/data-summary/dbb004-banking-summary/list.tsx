import { NextApiRequest } from "next";
import { ModifiedBankingSummary, ModifiedBankingSummaryRow } from "../../../../../interfaces/ModifiedBanking";
import fauna from "../../../../../lib/fauna/faunaClientV10";
import { Document, QueryValue } from "fauna"
import getDbb004BankingSummary from "../../../../../lib/fauna/ts-queries/data-summary/getDbb004BankingSummary";
import getUserDefinedDbb004BankingSummary from "../../../../../lib/fauna/ts-queries/data-summary/getUserDefinedDbb004BankingSummary";
import { CalculatedValue } from "../../../../../interfaces/MeterReading";

export default async function listDbb004BankingSummary(req: NextApiRequest): Promise<ModifiedBankingSummary> {
  try {
    const { permitNumber, year } = req.query

    if (!permitNumber || !year)
      throw new Error('permitNumber and year must be defined')

    if (permitNumber && Array.isArray(permitNumber))
      throw new Error('Only a single permitNumber may be defined.')

    if (year && Array.isArray(year))
      throw new Error('Only a single year may be defined.')

    const calculation = await fauna.query<Document & ModifiedBankingSummary>(getDbb004BankingSummary(permitNumber, year))
    const userDefined = await fauna.query<Document & ModifiedBankingSummary>(getUserDefinedDbb004BankingSummary(permitNumber, year))

    const base: ModifiedBankingSummaryRow[] = [
      {
        name: 'allowedAppropriation',
        value: undefined
      },
      {
        name: 'pumpingLimitThisYear',
        value: undefined
      },
      {
        name: 'flowMeterLimit',
        value: undefined
      },
    ]

    const calcData = calculation.data?.bankingData || []
    const userData = userDefined.data?.bankingData || []

    const bankingData = base.map(baseRow => {
      const calcValue = calcData.find(el => el.name === baseRow.name)?.value
      const userValue = userData.find(el => el.name === baseRow.name)?.value
      return {
        name: baseRow.name,
        value: compareUserDefinitiontoCalculatedValue(calcValue, userValue)
      }
    })

    return {
      permitNumber: permitNumber,
      year: year,
      bankingData: bankingData
    }

  } catch (error: any) {
    throw new Error(error)
  }
}

export function compareUserDefinitiontoCalculatedValue(calcData: CalculatedValue | undefined, userData: CalculatedValue | undefined): CalculatedValue | undefined {
  if (!calcData && !userData) return undefined
  if (!calcData && userData) return userData
  if (calcData && !userData) return calcData

  if (calcData && userData) {

    if (calcData.value !== userData.value) return {
      ...userData,
      shouldBe: calcData.value,
      calculationState: 'warning',
      calculationMessage: `Expected: ${calcData.value}`
    }

    return userData
  }
}

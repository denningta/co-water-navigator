import { NextApiRequest } from "next";
import { ModifiedBankingSummary } from "../../../../../interfaces/ModifiedBanking";
import fauna from "../../../../../lib/fauna/faunaClientV10";
import { Document } from "fauna"
import getDbb004BankingSummary from "../../../../../lib/fauna/ts-queries/data-summary/getDbb004BankingSummary";
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

    const { data } = await fauna.query<Document & ModifiedBankingSummary>(getDbb004BankingSummary(permitNumber, year))

    return data

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

import { NextApiRequest, NextApiResponse } from "next";
import fauna from "../../../../../lib/fauna/faunaClientV10";
import getDbb004BankingSummary from "../../../../../lib/fauna/ts-queries/data-summary/getDbb004BankingSummary";

export interface Dbb004BankingSummary {
  allowedAppropriation: number
  pumpingLimitThisYear: number
  flowMeterLimit: number
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any> {
  try {
    if (!req || !req.method) {
      throw new Error('No request or request method defined.')
    }

    const { permitNumber, year } = req.query

    if (!permitNumber || !year)
      throw new Error('permitNumber and year must be defined')

    if (permitNumber && Array.isArray(permitNumber))
      throw new Error('Only a single permitNumber may be defined.')

    if (year && Array.isArray(year))
      throw new Error('Only a single year may be defined.')

    const { data } = await fauna.query(getDbb004BankingSummary(permitNumber, year))

    res.status(200).json(data)

  } catch (error: any) {
    res.status(error?.status || 500).json(error)
  }



}

export default handler;

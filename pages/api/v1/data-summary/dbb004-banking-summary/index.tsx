import { NextApiRequest, NextApiResponse } from "next";
import faunaClient, { q } from "../../../../../lib/fauna/faunaClient";
import getLastMeterReadingPrevYear from "../../../../../lib/fauna/ts-queries/getLastMeterReadingPrevYear";
import getModifiedBankingQuery from "../../../../../lib/fauna/ts-queries/getModifiedBankingQuery";
import getDbb004BankingSummary from "../../../../../lib/fauna/ts-queries/getDbb004BankingSummary";

async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
): Promise<any> {
  try {
    if (!req || !req.method) {
      throw new Error('No request or request method defined.')
    }

    const { permitNumber, year }  = req.query

    if (!permitNumber || !year)
      throw new Error('permitNumber and year must be defined')

    if (permitNumber && Array.isArray(permitNumber)) 
      throw new Error('Only a single permitNumber may be defined.')

    if (year && Array.isArray(year)) 
      throw new Error('Only a single year may be defined.')


    const response = await faunaClient.query(
      getDbb004BankingSummary(permitNumber, year)
    )

    res.status(200).json(response)

  } catch (error: any) {
    res.status(error?.status || 500).json(error)
  }



}

export default handler;

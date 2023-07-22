import { NextApiRequest, NextApiResponse } from "next";
import { ModifiedBanking } from "../../../../../../interfaces/ModifiedBanking";
import faunaClient from "../../../../../../lib/fauna/faunaClient";
import getModifiedBankingQuery from "../../../../../../lib/fauna/ts-queries/getModifiedBankingQuery";

async function listModifiedBanking(req: NextApiRequest, res: NextApiResponse): Promise<ModifiedBanking> {
  try {
    const { permitNumber, year } = req.query;

    if (!permitNumber || !year)
      throw new Error('permitNumber and year must be defined')

    if (permitNumber && Array.isArray(permitNumber))
      throw new Error('Only a single permitNumber may be defined.')

    if (year && Array.isArray(year))
      throw new Error('Only a single year may be defined.')

    const response: ModifiedBanking = await faunaClient.query(getModifiedBankingQuery(permitNumber, year))

    return response


  } catch (error: any) {
    return error
  }
}

export default listModifiedBanking;

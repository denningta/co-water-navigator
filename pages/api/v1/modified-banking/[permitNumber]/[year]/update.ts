import { Document } from "fauna";
import { NextApiRequest, NextApiResponse } from "next";
import { ModifiedBanking } from "../../../../../../interfaces/ModifiedBanking";
import fauna from "../../../../../../lib/fauna/faunaClientV10";
import upsertModifiedBanking from "../../../../../../lib/fauna/ts-queries/modified-banking/upsertModifiedBanking";
import { runCalculationsInternal } from "./calculate";

async function updateModifiedBankingHandler(req: NextApiRequest, res: NextApiResponse): Promise<ModifiedBanking> {
  try {
    const { permitNumber, year } = req.query;

    if (!permitNumber || Array.isArray(permitNumber)) {
      throw new Error('permitNumber does not exist or is an array')
    }
    if (!year || Array.isArray(year)) {
      throw new Error('year does not exist or is an array')
    }
    if (!req.body) throw new Error('body was missing or undefined in the request')

    const data = await updateModifiedBanking(permitNumber, year, req.body)
    return data

  } catch (error: any) {
    throw new Error(error)
  }

}


export const updateModifiedBanking = async (permitNumber: string, year: string, modifiedBanking: ModifiedBanking) => {
  try {
    const calculationUpdates = await runCalculationsInternal(modifiedBanking, permitNumber, year)

    const updateData = calculationUpdates ?
      {
        ...calculationUpdates,
        permitNumber: permitNumber,
        year: year
      } :
      modifiedBanking

    const { data } = await fauna.query<Document & ModifiedBanking>(upsertModifiedBanking(updateData))
    return data

  } catch (error: any) {
    throw new Error(error)
  }
}

export default updateModifiedBankingHandler

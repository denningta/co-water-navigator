import { NextApiRequest, NextApiResponse } from "next";
import { ModifiedBanking } from "../../../../../../interfaces/ModifiedBanking";
import faunaClient from "../../../../../../lib/fauna/faunaClient";
import upsertModifiedBanking from "../../../../../../lib/fauna/ts-queries/upsertModifiedBanking";
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

    const data = updateModifiedBanking(permitNumber, year, req.body)
    return data

  } catch (error: any) {
    return error
  }

}


export const updateModifiedBanking = async (permitNumber: string, year: string, data: ModifiedBanking) => {
  try {
    const calculationUpdates = await runCalculationsInternal(data, permitNumber, year)
    const updateData = calculationUpdates ? { ...calculationUpdates } : data

    const response: any = await faunaClient.query(
      upsertModifiedBanking(permitNumber, year, updateData)
    )
    return response.data

  } catch (error) {
    return error
  }
}

export default updateModifiedBankingHandler

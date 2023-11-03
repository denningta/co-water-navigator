import { NextApiRequest } from "next";
import fauna from "../../../../../lib/fauna/faunaClientV10";
import upsertModifiedBankingSummary from "../../../../../lib/fauna/ts-queries/data-summary/upsertModifiedBankingSummary";

export default async function updateDbb004BankingSummary(req: NextApiRequest) {
  try {
    const { body } = req
    if (!body) throw new Error('A body was not included in the request')

    const { data } = await fauna.query(upsertModifiedBankingSummary(body))
    return data

  } catch (error: any) {
    throw new Error(error)
  }
}

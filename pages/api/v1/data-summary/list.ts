import { NextApiRequest } from "next";
import faunaClient from "../../../../lib/fauna/faunaClient";
import getDataSummary from "../../../../lib/fauna/ts-queries/getDataSummary";
import getUniquePermitNumbersWithData from "../../../../lib/fauna/ts-queries/getUniquePermitNumbersWithData";

async function listDataSummary(req: NextApiRequest): Promise<any[]> {
  try {
    const { permitNumber } = req.query

    let permitNumbers = permitNumber

    if (!permitNumbers) {
      permitNumbers = await faunaClient.query(getUniquePermitNumbersWithData())
    }

    if (!permitNumbers) throw new Error('No meter readings or modified banking data found')
    if (!Array.isArray(permitNumbers)) permitNumbers = [permitNumbers]

    const response: any = await faunaClient.query(getDataSummary(permitNumbers))
    return response;

  } catch (error: any) {
    return error
  }

}

export default listDataSummary

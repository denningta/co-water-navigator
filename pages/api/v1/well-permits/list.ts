import { Expr } from "faunadb";
import { NextApiRequest } from "next";
import { WellPermitWithRecords } from "../../../../interfaces/WellPermit";
import faunaClient from "../../../../lib/fauna/faunaClient";
import { getWellPermits } from "../../../../lib/fauna/ts-queries/getWellPermits";

async function listWellPemitsHandler(req: NextApiRequest): Promise<WellPermitWithRecords[]> {

  try {
    const response = await listWellPermits(req.query)
    return response

  } catch (error: any) {
    throw new Error(error)
  }
}


export interface WellPermitsQuery {
  document_ids?: string[] | Expr
  permitNumbers?: string[] | Expr
}

export async function listWellPermits(query: WellPermitsQuery) {

  try {
    const response: WellPermitWithRecords[] = await faunaClient.query(getWellPermits(query))
    return response

  } catch (error: any) {
    throw new Error(error)
  }
}

export default listWellPemitsHandler

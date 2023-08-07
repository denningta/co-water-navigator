import { NextApiRequest } from "next";
import { WellPermit } from "../../../../../interfaces/WellPermit";
import faunaClient from "../../../../../lib/fauna/faunaClient";
import { upsertWellPermitAndRecords } from "../../../../../lib/fauna/ts-queries/upsertWellPermitRecords";
import { listCodwrWellPermits } from "./list";

async function createWellPermits(req: NextApiRequest): Promise<WellPermit[]> {
  if (!req.body) throw new Error('No body was included in the request.')

  try {
    const permits = await listCodwrWellPermits(req.body.map((record: WellPermit) => record.receipt))

    const response: any = await faunaClient.query(
      upsertWellPermitAndRecords(permits)
    );

    console.log(response)

    return response

  } catch (error: any) {
    throw new Error(error)
  }

}

export default createWellPermits;

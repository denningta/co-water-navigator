import { Document } from "fauna";
import { NextApiRequest } from "next";
import { WellPermit } from "../../../../../interfaces/WellPermit";
import fauna from "../../../../../lib/fauna/faunaClientV10";
import upsertWellPermitAndRecords from "../../../../../lib/fauna/ts-queries/well-permits/upsertWellPermitsAndRecords";
import { listCodwrWellPermits } from "./list";

async function createWellPermits(req: NextApiRequest): Promise<WellPermit[]> {
  const { body } = req
  if (!body) throw new Error('No body was included in the request.')

  const receipts: string[] = body.map((record: WellPermit) => {
    if (!record.receipt) throw new Error('A record was missing a receipt property')
    return record.receipt
  })


  try {
    const permits = await listCodwrWellPermits(receipts)

    const { data } = await fauna.query<Array<Document & WellPermit>>(
      upsertWellPermitAndRecords(permits)
    );


    return data

  } catch (error: any) {
    throw new Error(error)
  }

}

export default createWellPermits;

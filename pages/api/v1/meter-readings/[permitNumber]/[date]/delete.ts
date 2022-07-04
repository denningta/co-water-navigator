import { NextApiRequest } from "next";
import Error from "next/error";
import MeterReading from "../../../../../../interfaces/MeterReading";
import faunaClient, { q } from "../../../../../../lib/faunaClient";

interface DeleteProps {
  records: MeterReading[];
}

async function deleteMeterReading(req: NextApiRequest): Promise<MeterReading> {

  const { records }: DeleteProps = body;

  return await faunaClient.query(
    q.Map(records, 
      (meterReading) => {
        return q.Delete(
          q.Select(['ref'], q.Get(
            q.Match(
              q.Index('meter-readings-by-permitnumber-date'), 
              [permitNumber, q.Select(['date'], meterReading)]
            )
          ))
        )
      }  
    )
  )

}

export default deleteMeterReading;

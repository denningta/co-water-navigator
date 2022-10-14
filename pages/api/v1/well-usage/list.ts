import { NextApiRequest, NextApiResponse } from "next";
import { WellUsage } from "../../../../interfaces/ModifiedBanking";
import faunaClient, { q } from "../../../../lib/fauna/faunaClient";

const getWellUsage = async (req: NextApiRequest) => {
  try {
    const { permitNumber, year } = req.query 

    if (!permitNumber || ! year)
      throw new Error('permitNumber and year must be defined')

    if (permitNumber && Array.isArray(permitNumber)) 
      throw new Error('Only a single permitNumber may be defined.')

    if (year && Array.isArray(year)) 
      throw new Error('Only a single year may be defined.')

    const response: WellUsage = await faunaClient.query(
      q.Let(
        {
          wellUsage: q.Map(
            q.Paginate(
              q.Match(q.Index('wellUsage-by-permitnumber-year'), [permitNumber, year])
            ),
            q.Lambda('el',
              q.Select(['data'], q.Get(q.Var('el')))
            )
          )
        },
        q.If(
          q.ContainsPath(['data', 0], q.Var('wellUsage')),
          q.Select(['data', 0], q.Var('wellUsage')),
          []
        )
      )
    )

    return response


  } catch (error: any) {
    throw new Error(error)
  }
}

export default getWellUsage
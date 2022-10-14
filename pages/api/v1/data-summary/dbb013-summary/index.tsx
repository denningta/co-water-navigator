import { NextApiRequest, NextApiResponse } from "next";
import faunaClient, { q } from "../../../../../lib/fauna/faunaClient";
import getLastMeterReadingPrevYear from "../../../../../lib/fauna/ts-queries/getLastMeterReadingPrevYear";
import getModifiedBankingQuery from "../../../../../lib/fauna/ts-queries/getModifiedBankingQuery";

async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
): Promise<any> {
  try {
    if (!req || !req.method) {
      throw new Error('No request or request method defined.')
    }

    const { permitNumber, year }  = req.query

    if (!permitNumber || !year)
      throw new Error('permitNumber and year must be defined')

    if (permitNumber && Array.isArray(permitNumber)) 
      throw new Error('Only a single permitNumber may be defined.')

    if (year && Array.isArray(year)) 
      throw new Error('Only a single year may be defined.')


    const response = await faunaClient.query(
      q.Let(
        {
          modifiedBanking: getModifiedBankingQuery(permitNumber, year),
          allowedAppropriation: 
            q.If(
              q.ContainsPath(['originalAppropriation', 'value'], q.Var('modifiedBanking')),
              q.Select(['originalAppropriation', 'value'], q.Var('modifiedBanking')),
              null
            ),
          pumpingLimitThisYear:
            q.If(
              q.ContainsPath(['pumpingLimitThisYear', 'value'], q.Var('modifiedBanking')),
              q.Select(['pumpingLimitThisYear', 'value'], q.Var('modifiedBanking')),
              null
            ),
           meterReadingLastYear: getLastMeterReadingPrevYear(permitNumber, year),
           lastFlowMeterPrevYear:
              q.If(
                q.ContainsPath(['flowMeter', 'value'], q.Var('meterReadingLastYear')),
                q.Select(['flowMeter', 'value'], q.Var('meterReadingLastYear')),
                null
              )
        },
        {
          allowedAppropriation: q.Var('allowedAppropriation'),
          pumpingLimitThisYear: q.Var('pumpingLimitThisYear'),
          flowMeterLimit: q.Add(q.Var('lastFlowMeterPrevYear'), q.Var('pumpingLimitThisYear'))
        }
      )
    )

    console.log(response)

    res.status(200).json(response)

  } catch (error: any) {
    res.status(error?.status || 500).json(error)
  }



}

export default handler;

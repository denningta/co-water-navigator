import _ from "lodash"
import { NextApiRequest, NextApiResponse } from "next";
import { ModifiedBanking } from "../../../../../../../interfaces/ModifiedBanking"
import faunaClient, { q } from "../../../../../../../lib/fauna/faunaClient"
import getModifiedBankingQuery from "../../../../../../../lib/fauna/ts-queries/getModifiedBankingQuery";
import calculationFns, { CalculationProps } from "./calculationFns"

type HandlerFunctions = {
  [key: string]: (req: NextApiRequest) => Promise<ModifiedBanking | undefined>
};


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (!req || !req.method) {
      throw new Error('Invalid request')
    }

    const handlers: HandlerFunctions = {
      POST: runCalculationsExternal,
    }

    const data = await handlers[req.method](req)
    console.log('handler', data)
    res.status(200).json(data)

  } catch (error: any) {
    res.status(500).json(error)
  }

}
export const runCalculationsExternal = async (req: NextApiRequest): Promise<ModifiedBanking | undefined> => {
  try {
    const { permitNumber, year } = req.query

    if (!permitNumber || Array.isArray(permitNumber)) throw new Error('Invalid permitNumber')
    if (!year || Array.isArray(year)) throw new Error('Invalid year')

    const modifiedBankingData: ModifiedBanking = await faunaClient.query(getModifiedBankingQuery(permitNumber, year))

    const data = await runCalculationsInternal(modifiedBankingData, permitNumber, year)

    return data

  } catch (error: any) {
    throw new Error(error)
  }

}



export const runCalculationsInternal = (
  modifiedBankingData: ModifiedBanking,
  permitNumber: string,
  year: string
): Promise<ModifiedBanking | undefined> => {
  return new Promise(async (resolve, reject) => {
    const dependencies: Omit<CalculationProps, 'data'> | void =
      await queryDependencies(permitNumber, year)
        .then(res => res)
        .catch(error => reject(error))

    if (!dependencies) {
      reject(new Error(
        'Modified banking calculations failed: Missing dependencies' +
        `No data found matching the query paramters: ` +
        `'permitNumber': ${permitNumber}, year: ${year}`
      ))
      return
    }

    const props: CalculationProps = {
      data: modifiedBankingData,
      dataLastYear: dependencies.dataLastYear,
      bankingReserveLastYear: dependencies.bankingReserveLastYear,
      totalPumpedThisYear: dependencies.totalPumpedThisYear
    }

    resolve(calculate(props))
  })
}

export const queryDependencies = (
  permitNumber: string, year: string
): Promise<Omit<CalculationProps, 'data'>> => {
  return new Promise(async (resolve, reject) => {
    const totalPumpedThisYearQuery =
      q.Let(
        {
          pumpedYearToDateArray: q.Map(
            q.Filter(
              q.Map(
                q.Paginate(
                  q.Join(
                    q.Match(q.Index('meter-readings-by-permitNumber-year'), [permitNumber, year]),
                    q.Index('meter-readings-sort-by-date-asc')
                  )
                ),
                q.Lambda(
                  ['date', 'ref'],
                  q.Select(['data'], q.Get(q.Var('ref')))
                )
              ),
              q.Lambda(
                'ref',
                q.ContainsPath(['pumpedYearToDate', 'value'], q.Var('ref'))
              )
            ),
            q.Lambda(
              'ref',
              q.Select(['pumpedYearToDate', 'value'], q.Var('ref'))
            )
          )
        },
        q.If(
          q.IsEmpty(q.Select(['data'], q.Var('pumpedYearToDateArray'))),
          null,
          q.Select(0, q.Max(q.Var('pumpedYearToDateArray'))),
        )
      )

    const dataLastYearQuery =
      q.Let({
        data: q.Map(
          q.Paginate(
            q.Match(q.Index('admin-reports-by-permitnumber-year'), [permitNumber, (+year - 1).toString()])
          ),
          q.Lambda(
            'ref',
            q.Select(['data'], q.Get(q.Var('ref')))
          )
        )
      },
        q.If(
          q.ContainsPath(['data', 0], q.Var('data')),
          q.Select(['data', 0], q.Var('data')),
          null
        )
      )

    const response: any = await faunaClient.query(
      q.Let({ dataLastYear: dataLastYearQuery },
        {
          dataLastYear: q.Var('dataLastYear'),
          bankingReserveLastYear:
            q.If(
              q.ContainsPath(['bankingReserveThisYear', 'value'], q.Var('dataLastYear')),
              q.Select(['bankingReserveThisYear', 'value'], q.Var('dataLastYear')),
              null
            ),
          totalPumpedThisYear: totalPumpedThisYearQuery
        }
      )
    ).catch(error => reject(error))

    const result: Omit<CalculationProps, 'data'> = { ...response }
    resolve(result)
  })

}

export const calculate = (
  props: CalculationProps
): ModifiedBanking | undefined => {
  const { data } = props

  const refRecord = {
    ...data
  }

  const calculatedFields = Object.keys(calculationFns) as (keyof typeof calculationFns)[]

  calculatedFields.forEach(field => {
    refRecord[field] = calculationFns[field]({ ...props, data: refRecord })
  })

  let updateRecord = false

  calculatedFields.forEach(field => {
    if (_.isEqual(refRecord[field], data[field])) return
    if (refRecord[field] === undefined) delete refRecord[field]
    updateRecord = true
  })

  if (!updateRecord) return

  return refRecord
}

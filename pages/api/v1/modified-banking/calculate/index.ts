import _ from "lodash"
import { ModifiedBanking } from "../../../../../interfaces/ModifiedBanking"
import faunaClient, { q } from "../../../../../lib/fauna/faunaClient"
import { HttpError } from "../../interfaces/HttpError"
import calculationFns, { CalculationProps } from "./calculationFns"

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
      reject(new HttpError(
        'Modified banking calculations failed: Missing dependencies',
        `No data found matching the query paramters: ` + 
        `'permitNumber': ${permitNumber}, year: ${year}`,
        404
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
          flowMeterArray: q.Map(
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
              q.ContainsPath(['flowMeter', 'value'], q.Var('ref'))
            )
          ),
          q.Lambda(
            'ref',
            q.Select(['flowMeter', 'value'], q.Var('ref'))
          )
        )
        },
        q.If(
          q.IsEmpty(q.Select(['data'], q.Var('flowMeterArray'))),
          null,
          q.Subtract(
            q.Select(0, q.Max(q.Var('flowMeterArray'))), 
            q.Select(0, q.Min(q.Var('flowMeterArray')))
          ),
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

import { q } from "../../faunaClient";

const getUniquePermitNumbersWithData = () =>
  q.Let({
    permitsWithMeterReadings: q.Map(
      q.Paginate(q.Documents(q.Collection('meterReadings'))),
      q.Lambda('meterReading',
        q.Select(['data', 'permitNumber'], q.Get(q.Var('meterReading')))
      )
    ),
    permitsWithAdminReports: q.Map(
      q.Paginate(q.Documents(q.Collection('administrativeReports'))),
      q.Lambda('adminReport',
        q.Select(['data', 'permitNumber'], q.Get(q.Var('adminReport')))
      )
    )
  },
    q.Distinct(
      q.Prepend(
        q.Select(['data'], q.Var('permitsWithMeterReadings')),
        q.Select(['data'], q.Var('permitsWithAdminReports')),
      )
    )
  )

export default getUniquePermitNumbersWithData

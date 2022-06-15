import { match } from "assert";
import { Expr } from "faunadb";
import { NextApiRequest } from "next";
import faunaClient, { q } from "../../../../../lib/faunaClient";

async function retrieveMeterReadings(permitNumber: string | string[], query: NextApiRequest["query"]) {
  console.log(query)
  if (query.start && query.end && (query.month || query.year)) {
    return Promise.reject({
      error: 'Invalid parameters',
      detail: '"start" and "end" parameters must be defined separately from "month" and "year"',
      status: 400,
      statusDetail: 'Bad Request'
    })
  }

  if (Array.isArray(query.start) || Array.isArray(query.end)) {
    return Promise.reject({
      error: 'Invalid parameters',
      detail: 'Only one start and/or end date may be defined per request.  If multiple date ranges are required, initiate a new request.',
      status: 400,
      statusDetail: 'Bad Request'
    })
  }

  const dateRegEx: RegExp = /(\d{4})\/(\d{2})/ // RegEx Format: YYYY/MM
  if (query.start && !query.start.match(dateRegEx) || query.end && !query.end.match(dateRegEx)) {
    return Promise.reject({
      error: 'Invalid parameter',
      detail: 'Incorrect format for start or end date.  Use format: YYYY/MM',
      status: 400,
      statusDetail: 'Bad Request'
    });
  }

  const years = Array.isArray(query.year) ? query.year : [query.year];

  if (years.length && years.every(year => isNaN(+year))) {
   return Promise.reject({
     error: 'Invalid parameter',
     detail: 'Query parameter for "year" must be a valid number.  Ex: ...?year=2022',
     status: 400,
     statusDetail: 'Bad Request'
   });
  }

  let faunaQuery: Expr = q.Match(q.Index('meter-readings-by-permit-number'), permitNumber); // Search by permitNumber

  if (query.date) { // Search by year and month
    faunaQuery = q.Match(q.Index('meter-readings-by-permitnumber-date'), [permitNumber, query.date]);
  }

  if (query.year) {
    faunaQuery = q.Union(
      q.Map(years,
        q.Lambda('year',
          q.Intersection(
            q.Match(q.Index('meter-readings-by-year'), q.Var('year')),
            q.Match(q.Index('meter-readings-by-permit-number'), permitNumber)
          )
        )
      )
    )
  }

  return faunaClient.query(
    q.Map(
      q.Paginate(
        faunaQuery
      ),
      q.Lambda(x => q.Get(x))
    ),
  )
    .then((res: any) => {
      const response = res.data.map((faunaRecord: any) => faunaRecord.data)
      return response
    })
    .catch(error => error);
}

export default retrieveMeterReadings;
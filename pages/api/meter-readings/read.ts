import { Expr, FaunaHttpErrorResponseContent } from "faunadb";
import { NextApiRequest } from "next";
import faunaClient, { q } from "../../../lib/faunaClient";

function readMeterReadings(query: NextApiRequest["query"]) {
  if (!query.permitnumber) {
    return Promise.reject(`
      Query parameter for "permitnumber" was not defined but is required.
      Define query parameters: .../api/meter-reading?permitnumber=12345&month=6&year=2022
    `)
  }

  if (query.year && !(+query.year)) {
    return Promise.reject(`
      Query parameter for "year" must be a valid number.  Ex: 2022.
    `)
  }

  if (query.month && !(+query.month)) {
    return Promise.reject(`
      Query parameter for "month" must be a valid number.  Ex: 2022.
    `)
  }

  let faunaQuery: Expr;

  if (!query.year && !query.month) { // Search by permitnumber
    faunaQuery = q.Match(q.Index('meter-readings-by-permit-number'), query.permitnumber)
  } else if (!query.month) { // Search by year
    faunaQuery = q.Intersection(
      q.Match(q.Index('meter-readings-by-permit-number'), query.permitnumber),
      q.Match(q.Index('meter-readings-by-year'), +query.year)
    )
  } else if (query.month && !query.year) { // Search by month only
    faunaQuery = q.Intersection(
      q.Match(q.Index('meter-readings-by-permit-number'), query.permitnumber),
      q.Match(q.Index('meter-readings-by-month'), +query.month)
    );
  } else { // Search by year and month
    faunaQuery = q.Intersection(
      q.Match(q.Index('meter-readings-by-permit-number'), query.permitnumber),
      q.Match(q.Index('meter-readings-by-year'), +query.year),
      q.Match(q.Index('meter-readings-by-month'), +query.month)
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
    .then((res) => res)
    .catch(error => error);
}

export default readMeterReadings;
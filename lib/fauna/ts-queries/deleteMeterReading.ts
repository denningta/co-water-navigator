import { Expr } from "faunadb"
import { q } from "../faunaClient"

const deleteMeterReading = (permitNumber: string | Expr, date: string | Expr) =>
  q.Delete(q.Select(['ref'], q.Get(
    q.Match(q.Index('meter-readings-by-permitnumber-date'), [permitNumber, date])
  )))

export default deleteMeterReading

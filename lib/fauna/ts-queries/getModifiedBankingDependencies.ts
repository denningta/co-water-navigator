import { Expr } from "faunadb";
import { q } from "../faunaClient";
import getModifiedBankingLastYear from "./getModifiedBankingLastYear";
import getTotalPumpedThisYear from "./getTotalPumpedThisYear";

const getModifiedBankingDependencies = (
  permitNumber: string | Expr,
  year: string | Expr
) =>
  q.Let({ dataLastYear: getModifiedBankingLastYear(permitNumber, year) },
    {
      dataLastYear: q.Var('dataLastYear'),
      bankingReserveLastYear:
        q.If(
          q.ContainsPath(['bankingReserveThisYear', 'value'], q.Var('dataLastYear')),
          q.Select(['bankingReserveThisYear', 'value'], q.Var('dataLastYear')),
          null
        ),
      totalPumpedThisYear: getTotalPumpedThisYear(permitNumber, year)
    }
  )

export default getModifiedBankingDependencies

import { Expr } from "faunadb";
import { q } from "../../faunaClient";
import getLastMeterReadingPrevYear from "./getLastMeterReadingPrevYear";
import getModifiedBankingQuery from "../getModifiedBankingQuery";

const getDbb004BankingSummary = (permitNumber: string | Expr, year: string | Expr) =>
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
      flowMeterLimit:
        q.If(
          q.And(q.IsNumber(q.Var('lastFlowMeterPrevYear')), q.IsNumber(q.Var('pumpingLimitThisYear'))),
          q.Add(q.Var('lastFlowMeterPrevYear'), q.Var('pumpingLimitThisYear')),
          null
        )
    }
  )

export default getDbb004BankingSummary

import { NextApiRequest } from "next";
import MeterReading from "../../../../interfaces/MeterReading";
import faunaClient, { q } from "../../../../lib/fauna/faunaClient";
import getDataSummary from "../../../../lib/fauna/ts-queries/getDataSummary";
import getLastMeterReadingPrevYear from "../../../../lib/fauna/ts-queries/getLastMeterReadingPrevYear";
import getUniquePermitNumbersWithData from "../../../../lib/fauna/ts-queries/getUniquePermitNumbersWithData";
import { HttpError } from "../interfaces/HttpError";
import validateQuery from "../validatorFunctions";

async function listDataSummary(req: NextApiRequest): Promise<any[]> {
  try {
    const { permitNumber } = req.query

    let permitNumbers = permitNumber

    if (!permitNumbers) {
      permitNumbers = await faunaClient.query(getUniquePermitNumbersWithData())
    }

    if (!permitNumbers) throw new Error('No meter readings or modified banking data found')
    if (!Array.isArray(permitNumbers)) permitNumbers = [permitNumbers]

    const test: any = await faunaClient.query(
      q.Let({
        permitNumber: '12124-RFP',
        year: '2018'
      }, getLastMeterReadingPrevYear(q.Var('permitNumber'), q.Var('year')))
    )
    console.log(test)

    const response: any = await faunaClient.query(getDataSummary(permitNumbers))
    // console.log(response)
    return response;

  } catch (error: any) {
    console.log(error)
    return error
  }

}

export default listDataSummary
import { Document } from "fauna";
import _ from "lodash"
import { NextApiRequest, NextApiResponse } from "next";
import { ModifiedBanking } from "../../../../../../../interfaces/ModifiedBanking"
import fauna from "../../../../../../../lib/fauna/faunaClientV10";
import getModifiedBankingDependencies from "../../../../../../../lib/fauna/ts-queries/modified-banking/getModifiedBankingDependencies";
import getModifiedBanking from "../../../../../../../lib/fauna/ts-queries/modified-banking/listModifiedBanking";
import upsertModifiedBanking from "../../../../../../../lib/fauna/ts-queries/modified-banking/upsertModifiedBanking";
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
    res.status(200).json(data)

  } catch (error: any) {
    res.status(500).send(error)
    throw new Error(error)
  }
}


export const runCalculationsExternal = async (req: NextApiRequest): Promise<ModifiedBanking | undefined> => {
  try {
    const { permitNumber, year } = req.query

    if (!permitNumber || Array.isArray(permitNumber)) throw new Error('Invalid permitNumber')
    if (!year || Array.isArray(year)) throw new Error('Invalid year')

    const { data } = await fauna.query<Document & ModifiedBanking>(getModifiedBanking(permitNumber, year))
    const { coll, id, ts, ...modifiedBanking } = data ?? {}

    const calcData = await runCalculationsInternal(modifiedBanking, permitNumber, year)

    if (calcData) {
      const { data } = await fauna.query<Document & ModifiedBanking>(upsertModifiedBanking(calcData))
      return data
    }

  } catch (error: any) {
    throw new Error(error)
  }
}


export const runCalculationsInternal = async (
  modifiedBankingData: ModifiedBanking,
  permitNumber: string,
  year: string
) => {
  try {
    const dependencies = await queryDependencies(permitNumber, year)

    if (!dependencies) throw new Error('Modified banking calculations failed: Missing dependencies')

    const props: CalculationProps = {
      data: modifiedBankingData,
      ...dependencies
    }

    const updatedData = calculate(props)
    return {
      ...updatedData,
      permitNumber,
      year
    }

  } catch (error: any) {
    throw new Error(error)
  }
}



export const queryDependencies = async (
  permitNumber: string, year: string
) => {
  try {
    const { data } = await fauna.query<Document>(getModifiedBankingDependencies(permitNumber, year))
    return data

  } catch (error: any) {
    throw new Error(error)
  }
}

export const calculate = (
  props: CalculationProps
): ModifiedBanking | undefined => {
  const data = props.data ?? {}

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

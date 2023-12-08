import { Document } from "fauna";
import _ from "lodash"
import { NextApiRequest, NextApiResponse } from "next";
import { ModifiedBanking, ModifiedBankingDependencies } from "../../../../../../../interfaces/ModifiedBanking"
import faunaClient, { q } from "../../../../../../../lib/fauna/faunaClient"
import fauna from "../../../../../../../lib/fauna/faunaClientV10";
import getModifiedBankingQuery from "../../../../../../../lib/fauna/ts-queries/getModifiedBankingQuery";
import getModifiedBankingDependencies from "../../../../../../../lib/fauna/ts-queries/modified-banking/getModifiedBankingDependencies";
import { updateModifiedBanking } from "../update";
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

    if (data) {
      const updateRes = await updateModifiedBanking(permitNumber, year, data)
      return updateRes
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
    return updatedData

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
  const { data } = props

  const refRecord = {
    ...data
  }

  const calculatedFields = Object.keys(calculationFns) as (keyof typeof calculationFns)[]

  calculatedFields.forEach(field => {
    refRecord[field] = calculationFns[field]({ ...props, data: refRecord })
    if (field === 'pumpingLimitNextYear') console.log(refRecord[field])
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

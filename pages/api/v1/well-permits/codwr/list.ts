import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { WellPermit } from "../../../../../interfaces/WellPermit";

async function listCodwrWellPermitsHandler(req: NextApiRequest): Promise<WellPermit[]> {

  const { receipts } = req.query

  if (!receipts) throw new Error('Invalid query: provide a receipts query')

  try {
    const response = await listCodwrWellPermits([...receipts])
    return response

  } catch (error: any) {
    throw new Error(error)

  }

}


export const listCodwrWellPermits = async (receipts: string[]) => {
  try {
    const permits = await Promise.all(
      receipts.map(async (receipt) => {
        const response = await axios.get(
          `https://dwr.state.co.us/Rest/GET/api/v2/wellpermits/wellpermit/` +
          `?format=json` +
          `&receipt=${receipt}`
        )
        return response.data
      })
    )

    const codwrPermits = permits.map(permit => {
      const result = permit.ResultList[0]
      // remove spaces from receipt field - fauna is using this as an index
      result.receipt = result.receipt.replace(/\s/g, '')
      return result
    })

    return codwrPermits

  } catch (error: any) {
    throw new Error(error)
  }

}

export default listCodwrWellPermitsHandler;

import { getSession } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import fauna from "../../../../../lib/fauna/faunaClientV10";
import getPermitPreview from "../../../../../lib/fauna/ts-queries/permit-preview/getPermitPreview";

async function permitPreviewHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (!req || !req.method) {
      throw new Error('No request or request method defined.')
    }

    let document_ids: string[] = []

    const session = getSession(req, res)
    const { permitRefs } = session?.user.app_metadata

    if (!permitRefs) {
      const response: string[] = []
      res.status(200).json(response)
      return response
    }

    document_ids = permitRefs.filter((el: any) => el.status === 'approved').map((el: any) => el.document_id)

    const { data } = await fauna.query(
      getPermitPreview(document_ids)
    )

    res.status(200).json(data)

  } catch (error: any) {
    res.status(error?.status || 500).send(error)
    throw new Error(error)
  }
}

export default permitPreviewHandler;


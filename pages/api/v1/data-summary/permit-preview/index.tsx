import { getSession } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import fauna from "../../../../../lib/fauna/faunaClientV10";
import getPermitPreview from "../../../../../lib/fauna/ts-queries/permit-preview/getPermitPreview";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any> {
  try {
    if (!req || !req.method) {
      throw new Error('No request or request method defined.')
    }

    const session = getSession(req, res)
    const { permitRefs } = session?.user.app_metadata

    const document_ids = permitRefs
      ? permitRefs.filter((el: any) => el.status === 'approved').map((el: any) => el.document_id)
      : []

    const { data } = await fauna.query(
      getPermitPreview(document_ids)
    )

    res.status(200).json(data)

  } catch (error: any) {
    res.status(error?.status || 500).json(error)
  }
}

export default handler;

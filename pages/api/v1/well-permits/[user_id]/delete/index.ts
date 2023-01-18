import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import { HttpError } from "../../../interfaces/HttpError";
import auth0 from "../../../../../../lib/auth0/auth0ManagementClient";


type HandlerFunctions = { 
  [key: string]: (req: NextApiRequest, res: NextApiResponse) => Promise<any> 
};

async function deleteHandler(
  req: NextApiRequest, 
  res: NextApiResponse
): Promise<any | HttpError> {
  if (!req.method) {
    throw new Error('Request method undefined')
  }
  
  if (req.method === 'DELETE') {
    const { user_id } = req.query
    if (!user_id) throw new Error('user_id was not included in the query')
    if (Array.isArray(user_id)) throw new Error('Querying by a single user_id is allowed at a time')

    const { document_ids }: { document_ids: string[] } = req.body
    if (!document_ids) throw new Error('No document_id query was defined')

    try {
      const { app_metadata } = await auth0.getUser({ id: user_id })

      const permitRefs = [ ...app_metadata?.permitRefs ]
  
      document_ids.forEach(document_id => {
        const matchIndex = permitRefs.findIndex(permitRef => permitRef.document_id === document_id)
        if (matchIndex >= 0) permitRefs.splice(matchIndex, 1)
      })
  
      const response = await auth0.updateAppMetadata({ id: user_id }, { permitRefs: permitRefs })
  
      res.status(200).json(response)
    } catch (error: any) {
      res.status(error.status || 500).json(error)
    }


  }

}

export default withApiAuthRequired(deleteHandler);


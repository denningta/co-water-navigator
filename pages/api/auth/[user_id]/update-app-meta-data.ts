import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import managementClient from "../../../../lib/auth0/auth0ManagementClient";
import { PermitRef, WellPermitStatus } from "../../../../interfaces/WellPermit";
import _ from "lodash";

const handleUpdateAppMetaData = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req

  if (!body.permitRefs) throw new Error('Bad Argument: permitRef missing from body of the request')

  body.permitRefs.map((permitRef: PermitRef) => {
    if (!permitRef.hasOwnProperty('document_id')) {
      throw new Error('Property missing: \'id\' missing from a record')
    }
  })

  try {
    const session = getSession(req, res)
    const id = session?.user.sub
    const response = await updatePermitRefs(id, body.permitRefs, req.method)
    res.status(200).json(response)
  } catch (error: any) {
    res.status(500).json({ statusCode: 500, message: error.message })
  }
}

export const updatePermitRefs = async (user_id: string, newPermitRefs: PermitRef[], method: string | undefined) => {
  try {
    const auth0 = managementClient
    const { app_metadata } = await auth0.getUser({ id: user_id })

    const oldPermitRefs: PermitRef[] | undefined = app_metadata?.permitRefs
    const warnings: string[] = []
    let updates: number = 0;

    if (oldPermitRefs) {
      newPermitRefs.forEach((newRef) => {
        const matchIndex = oldPermitRefs.findIndex((oldRef) => {
          return oldRef.document_id === newRef.document_id
        })

        if (method === 'POST') {
          if (matchIndex >= 0) {
            warnings.push(`Access already ${oldPermitRefs[matchIndex].status} for permit ${newRef.permit}`)
          } else {
            oldPermitRefs.push(newRef)
            updates++
          }
        } else if (method === 'PATCH') {
          if (matchIndex >= 0) {
            oldPermitRefs[matchIndex] = newRef
          } else {
            oldPermitRefs.push(newRef)
            updates++
          }
        } else {
          throw new Error('Invalid request method')
        }


      })
    }

    const response = await auth0.updateAppMetadata({ id: user_id }, { permitRefs: oldPermitRefs ?? newPermitRefs })
    return { data: response, updates: updates, warnings: warnings }

  } catch (error: any) {
    return error
  }
}

export default withApiAuthRequired(handleUpdateAppMetaData)

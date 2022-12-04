import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import managementClient from "../../../../lib/auth0/auth0ManagementClient";
import { v4 as uuidv4 } from 'uuid'
import { PermitRef } from "../../../../interfaces/WellPermit";
import { HttpError } from "../../v1/interfaces/HttpError";
import validateQuery from "../../v1/validatorFunctions";
import { reject } from "lodash";
import _ from "lodash";

const handleUpdateAppMetaData = async (req: NextApiRequest, res: NextApiResponse) => {
  const errors = validateQuery(req, [
    'bodyExists'
  ]);
  
  const { body } = req

  if (!body.permitRefs) errors.push(new HttpError(
    'Bad Argument',
    'permitRef missing from body of the request',
    400
  ))

  body.permitRefs.map((permitRef: PermitRef) => {
    if(!permitRef.hasOwnProperty('document_id')) {
      errors.push(new HttpError(
        'Property missing',
        'document_id missing from a record',
        400
      ))
    }
  })

  if (errors.length > 0) reject(errors)

  const session = await getSession(req, res)
  const id = session?.user.sub

  try {
    const response = await updatePermitRefs(id, body.permitRefs)
    res.status(200).json(response)
  } catch (error: any) {
    res.status(500).json({ statusCode: 500, message: error.message })
  }
}

export const updatePermitRefs = async (user_id: string, newPermitRefs: PermitRef[]) => {
  try {
    const auth0 = managementClient
    const { app_metadata } = await auth0.getUser({ id: user_id })

    const oldPermitRefs: PermitRef[] | undefined = app_metadata?.permitRefs

    if (oldPermitRefs) {
      // Upsert
      newPermitRefs.forEach((newRef, newIndex) => {
        const matchIndex = oldPermitRefs.findIndex((oldRef) => oldRef.document_id === newRef.document_id)
        if (matchIndex >= 0) oldPermitRefs[matchIndex] = newRef
        else oldPermitRefs.push(newRef)
      })
    }

    const response = await auth0.updateAppMetadata({ id: user_id }, { permitRefs: oldPermitRefs ?? newPermitRefs })
    return response

  } catch (error: any) {
    return error
  }
}

export default withApiAuthRequired(handleUpdateAppMetaData)
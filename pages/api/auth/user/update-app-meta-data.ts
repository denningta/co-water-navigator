import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import managementClient from "../../../../lib/auth0/auth0ManagementClient";
import { v4 as uuidv4 } from 'uuid'
import { PermitRef } from "../../../../interfaces/WellPermit";
import { HttpError } from "../../v1/interfaces/HttpError";
import validateQuery from "../../v1/validatorFunctions";
import { reject } from "lodash";

const updateAppMetaData = async (req: NextApiRequest, res: NextApiResponse) => {
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
    const auth0 = managementClient
    const { app_metadata } = await auth0.getUser({ id: id })

    const newPermitRefs: PermitRef[] = body.permitRefs
    const oldPermitRefs: PermitRef[] | undefined = app_metadata?.permitRefs
    let updatedPermitRefs: PermitRef[] = oldPermitRefs ?? []
    let difference: PermitRef[] = []

    if (oldPermitRefs) {
      difference = newPermitRefs.filter((newRef) => 
        !oldPermitRefs.some((oldRef) => 
          newRef.document_id === oldRef.document_id
        )
      ) 

      updatedPermitRefs = [ ...oldPermitRefs, ...difference ]
    }

    const added = `${difference.length} permit(s) added`
    const assigned = (newPermitRefs.length - difference.length) > 0 
    ? `, ${(newPermitRefs.length - difference.length)} already assigned to your account`
    : ''

    await auth0.updateAppMetadata({ id: id }, { permitRefs: updatedPermitRefs })

    res.status(200).json(`Success! ${added}${assigned}`)

  } catch (error: any) {
    res.status(500).json({ statusCode: 500, message: error.message })
  }


}

export default withApiAuthRequired(updateAppMetaData)
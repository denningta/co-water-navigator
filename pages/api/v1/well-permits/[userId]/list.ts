import { NextApiRequest, NextApiResponse } from "next";
import { PermitRef, WellPermit, WellPermitAssignment } from "../../../../../interfaces/WellPermit";
import faunaClient, { q } from "../../../../../lib/fauna/faunaClient";
import { getUser } from "../../../auth/user/get-user";
import { HttpError } from "../../interfaces/HttpError";
import validateQuery from "../../validatorFunctions";
import { getWellPermits } from '../../../../../lib/fauna/ts-queries/wellPermits' 

function handleListWellPemitsByUser(req: NextApiRequest, res: NextApiResponse): Promise<any> {
  return new Promise(async (resolve, reject) => {
    const errors = validateQuery(req, [
      'queryExists',
    ]);

    if (errors.length) reject(errors);

    const { userId } = req.query

    if (!userId) throw new Error('userId was not included in the query')
    if (Array.isArray(userId)) throw new Error('Querying by a single userId is allowed at a time')
    const user = await getUser(userId)
      .then(res => res)
      .catch(err => reject(err))
    if (!user) throw new Error(`User with userId: ${userId} not found`)
    
    if (!user.app_metadata?.permitRefs) throw new Error('No permits assigned to this user')
    const permitRefs = user.app_metadata.permitRefs
    const document_ids = permitRefs.map(permitRef => permitRef.document_id)

    const wellPermits = await faunaClient.query(getWellPermits(document_ids))
      .then(res => res)
      .catch(err => {
        errors.push(err)
        reject(errors)
        return err
      })

    const wellPermitAssignments = wellPermits.map((wellPermit: any) => {
      const permitRef = permitRefs.find(permitRef => permitRef.document_id === wellPermit.document_id)
      return {
        ...wellPermit.document,
        document_id: wellPermit.document_id,
        status: permitRef?.status,
      }
    })

    resolve(wellPermitAssignments)
  });
}

export const listWellPermitsByPermitRef = async (permitRefs: PermitRef[]): Promise<WellPermitAssignment[]> => {
  const document_ids = permitRefs.map(permitRef => permitRef.document_id)

  const wellPermits = await faunaClient.query(getWellPermits(document_ids))
    .then(res => res)
    .catch(err => {
      return err
    })

  const wellPermitAssignments = wellPermits.map((wellPermit: any) => {
    const permitRef = permitRefs.find(permitRef => permitRef.document_id === wellPermit.document_id)
    return {
      ...wellPermit.document,
      document_id: wellPermit.document_id,
      status: permitRef?.status,
    }
  })

  return wellPermitAssignments
}

export default handleListWellPemitsByUser

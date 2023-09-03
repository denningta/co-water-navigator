import { NextApiRequest } from "next";
import { PermitRef, WellPermitAssignment } from "../../../../../interfaces/WellPermit";
import faunaClient from "../../../../../lib/fauna/faunaClient";
import { getUser } from "../../../auth/[user_id]/get-user";
import validateQuery from "../../validatorFunctions";
import { getWellPermits } from '../../../../../lib/fauna/ts-queries/getWellPermits'

function handleListWellPemitsByUser(req: NextApiRequest): Promise<any> {
  return new Promise(async (resolve, reject) => {
    const errors = validateQuery(req, [
      'queryExists',
    ]);

    if (errors.length) reject(errors);

    const { user_id } = req.query

    if (!user_id) throw new Error('user_id was not included in the query')
    if (Array.isArray(user_id)) throw new Error('Querying by a single user_id is allowed at a time')
    const user = await getUser(user_id)
      .then(res => res)
      .catch(err => reject(err))
    if (!user) throw new Error(`User with user_id: ${user_id} not found`)

    if (!user.app_metadata?.permitRefs) return resolve([])
    const permitRefs = user.app_metadata.permitRefs
    const document_ids = permitRefs.map(permitRef => permitRef.document_id)

    const wellPermits = await faunaClient.query(getWellPermits({ document_ids: document_ids }))
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

  const wellPermits = await faunaClient.query(getWellPermits({ document_ids: document_ids }))
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

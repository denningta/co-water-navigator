import useSWR, { KeyedMutator } from "swr"
import { WellPermitAssignment } from "../interfaces/WellPermit"

const fetcher = async (url: string, user_id: string) => {
  const res = await fetch(url + '?user_id=' + user_id)
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    error.message = await res.json()
    throw error
  }
  return res.json()
}

const useWellPermitsByUser = (
  user_id: string | undefined
): { data: WellPermitAssignment[], mutate: KeyedMutator<any> } => {
  const { data, mutate } = useSWR(user_id ? `/api/v1/well-permits/${user_id}` : null, fetcher)

  return {
    data: data,
    mutate: mutate
  }
}

export default useWellPermitsByUser
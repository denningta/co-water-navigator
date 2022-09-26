import { Role } from "auth0"
import useSWR, { KeyedMutator } from "swr"
import { WellPermitAssignment } from "../interfaces/WellPermit"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    error.message = await res.json()
    throw error
  }
  return res.json()
}

const useRoles = (): { data: Role[], mutate: KeyedMutator<any> } => {
  const { data, mutate } = useSWR(`/api/auth/roles`, fetcher)

  return {
    data: data,
    mutate: mutate
  }
}

export default useRoles
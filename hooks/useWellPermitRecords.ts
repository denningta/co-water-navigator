import useSWR, { KeyedMutator } from "swr"
import { WellPermit, WellPermitAssignment } from "../interfaces/WellPermit"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    error.message = await res.json()
    throw error
  }
  return res.json()
}

const useWellPermitRecords = (
  permitNumber: string | undefined
): { data: WellPermit[], mutate: KeyedMutator<any> } => {
  const { data, mutate } = useSWR(
    permitNumber ? `/api/v1/well-permit-records?permitNumber=${permitNumber}`
      : null,
    fetcher
  )


  return {
    data: data,
    mutate: mutate
  }
}

export default useWellPermitRecords

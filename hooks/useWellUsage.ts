import useSWR, { KeyedMutator } from "swr"
import { WellUsage } from "../interfaces/ModifiedBanking"
import { WellPermitAssignment } from "../interfaces/WellPermit"

const fetcher = async (url: string, permitNumber: string, year: string) => {
  const res = await fetch(url + '?permitNumber=' + permitNumber + '&year=' + year)
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    error.message = await res.json()
    throw error
  }
  return res.json()
}

const useWellUsage = (
  permitNumber: string | undefined,
  year: string | undefined
): { data: WellUsage, mutate: KeyedMutator<any> } => {
  const { data, mutate } = useSWR([
      (permitNumber && year) ? `/api/v1/well-usage` : null,
      permitNumber,
      year
    ],
    fetcher
  )

  return {
    data: data,
    mutate: mutate
  }
}

export default useWellUsage
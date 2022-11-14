import useSWR, { KeyedMutator } from "swr"
import { ModifiedBankingSummary, WellUsage } from "../interfaces/ModifiedBanking"
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

const useDbb013Summary = (
  permitNumber: string | undefined,
  year: string | undefined
): { data: ModifiedBankingSummary, mutate: KeyedMutator<any> } => {
  const { data, mutate } = useSWR([
      (permitNumber && year) ? `/api/v1/data-summary/dbb013-summary` : null,
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

export default useDbb013Summary
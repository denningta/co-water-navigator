import useSWR from "swr"
import { ModifiedBanking } from "../interfaces/ModifiedBanking"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    error.message = await res.json()
    throw error
  }
  return res.json()
}

const useModifiedBanking = (
  permitNumber: string | undefined,
  year: string | undefined,
): UseSWR => {
  const { data, mutate, isValidating } = useSWR<ModifiedBanking>(
    (permitNumber && year)
      ? `/api/v1/modified-banking/${permitNumber}/${year}`
      : null,
    fetcher
  )

  return {
    data: data ?? {},
    mutate: mutate,
    isValidating: isValidating
  }
}

export default useModifiedBanking

type UseSWR = ReturnType<typeof useSWR<ModifiedBanking>>

import useSWR, { KeyedMutator } from "swr"

const fetcher = async (url: string, permitNumber: string | 'global') => {
  const res = await fetch(url + '?permitNumber=' + permitNumber)
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    error.message = await res.json()
    throw error
  }
  return res.json()
}

const useAgentInfo = (
  user_id: string | null | undefined,
  permitNumber: string | 'global' = 'global'
): { data: any, mutate: KeyedMutator<any> } => {
  const { data, mutate } = useSWR(
    user_id ? [
      `/api/auth/${user_id}/agent-info`,
      permitNumber
    ] : null,
    fetcher
  )

  return {
    data: data,
    mutate: mutate
  }
}

export default useAgentInfo

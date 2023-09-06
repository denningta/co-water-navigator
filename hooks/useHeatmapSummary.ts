import useSWR, { KeyedMutator } from "swr"

const fetcher = async (url: string, permitNumber: string) => {
  const res = await fetch(url + '?permitNumber=' + permitNumber)
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    error.message = await res.json()
    throw error
  }
  return res.json()
}

export interface HeatmapSummary {
  year: string
  percentComplete: number
}

const useHeatmapSummary = (
  permitNumber: string | undefined,
): { data: HeatmapSummary[], mutate: KeyedMutator<any> } => {
  const { data, mutate } = useSWR([
    (permitNumber) ? `/api/v1/data-summary/heatmap-summary` : null,
    permitNumber,
  ],
    fetcher
  )

  return {
    data: data,
    mutate: mutate
  }
}

export default useHeatmapSummary

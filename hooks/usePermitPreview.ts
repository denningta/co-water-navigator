import useSWR, { KeyedMutator } from "swr"
import { PermitPreviewData } from "../components/common/LineChart"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    error.message = await res.json()
    throw error
  }
  return res.json()
}

const usePermitPreview = (): { data: PermitPreviewData[], mutate: KeyedMutator<any> } => {
  const { data, mutate } = useSWR([
    `/api/v1/data-summary/permit-preview`
  ],
    fetcher
  )

  return {
    data: data,
    mutate: mutate
  }
}

export default usePermitPreview

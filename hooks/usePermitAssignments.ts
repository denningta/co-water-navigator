/* eslint-disable react-hooks/exhaustive-deps */
import { useUser } from "@auth0/nextjs-auth0"
import { useEffect, useState } from "react"
import useSWR from "swr"
import { Auth0AppMetadata } from "../interfaces/Auth0UserProfile"
import { AppMetadata } from "../interfaces/User"
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

const usePermitAssignments = (permitRefs: AppMetadata['permitRefs']) => {
  const [idsQuery, setIdsQuery] = useState<string | null>(null)
  const [
    permitAssignmentData, 
    setPermitAssignmentData
  ] = useState<WellPermitAssignment[] | undefined>(undefined)

  useEffect(() => {
    if (!permitRefs) return
    setIdsQuery(
      permitRefs.map((permitRef: any) => 
        `id=${permitRef.document_id}`
      ).join('&')
    )
  }, [permitRefs])

  const permitData = useSWR(
    (idsQuery) 
    ? `/api/v1/well-permits?${idsQuery}` 
    : null, 
    fetcher
  )

  useEffect(() => {
    if (!permitData.data || !permitRefs) return
    setPermitAssignmentData(
      permitData.data.map((permit: any) => ({
          ...permit.document,
          status: permitRefs.find(el => el.document_id === permit.id)?.status,
          document_id: permitRefs.find(el => el.document_id === permit.id)?.document_id
      }))
    )
  }, [permitData.data])

  return permitAssignmentData
}

export default usePermitAssignments
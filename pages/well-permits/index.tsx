import { ReactElement, useEffect, useState } from 'react'
import AppLayout from '../../components/AppLayout'
import { NextPageWithLayout } from '../_app'
import { getServerSidePropsWrapper, getSession, UserProvider, useUser } from '@auth0/nextjs-auth0'
import WellPermitTable from '../../components/widgets/DataTable/DataTable'
import MainContent, { Widget } from '../../components/MainContent'
import Header from '../../components/widgets/Header'
import WellPermitsAssignment from '../../components/widgets/WellPermitsAssignment/WellPermitsAssignment'
import WellPermitSearch from '../../components/widgets/WellPermitSearch/WellPermitSearch'
import { GetServerSideProps } from 'next'
import useSWR from 'swr'
import { Auth0AppMetadata } from '../../interfaces/Auth0UserProfile'


const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    error.message = await res.json()
    throw error
  }
  return res.json()
}

const WellPermits: NextPageWithLayout = () => {
  const { user }: any = useUser()
  const [idsQuery, setIdsQuery] = useState(null)
  const [permitAssignmentData, setPermitAssignmentData] = useState(undefined)
  const [appMetadata, setAppMetadata] = useState<Auth0AppMetadata | null>(null)

  useEffect(() => {
    if (!user || !user.app_metadata) return
    setIdsQuery(
      user.app_metadata.permitRefs.map((permitRef: any) => 
        `id=${permitRef.document_id}`
      ).join('&')
    )
    setAppMetadata(user.app_metadata)
  }, [user])

  const permitData = useSWR(
    (idsQuery) 
    ? `/api/v1/well-permits?${idsQuery}` 
    : null, 
    fetcher
  )

  useEffect(() => {
    if (!permitData.data || !appMetadata) return
    setPermitAssignmentData(
      permitData.data.map((permit: any) => ({
          ...permit.document,
          status: appMetadata.permitRefs.find(el => el.document_id === permit.id)?.status
      }))
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permitData.data, user])

  const widgets: Widget[] = [
    { 
      component: <Header 
        title="Well Permits"
        subtitle="Manage well permits and access meter readings"
      />, 
      colspan: 3
    },
    { component: <WellPermitsAssignment rowData={permitAssignmentData} />, colspan: 3 },
    { component: <WellPermitSearch />, colspan: 3 }
  ]

  return (
    <MainContent widgets={widgets} columns={3} />
  )
}

export const getServerSideProps: GetServerSideProps = getServerSidePropsWrapper(async ({ req, res }) => {
  const session = getSession(req, res)
  if (!session || !session.user) {
    return { redirect: { destination: '/api/auth/login', permanent: false } }
  }
  return { props: { user: session.user } }
})

WellPermits.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>
      {page}
    </AppLayout>
  )
}

export default WellPermits

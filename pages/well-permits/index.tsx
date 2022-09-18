import { ReactElement, useEffect, useState } from 'react'
import AppLayout from '../../components/AppLayout'
import { NextPageWithLayout } from '../_app'
import { getServerSidePropsWrapper, getSession, UserProvider, useUser, withPageAuthRequired } from '@auth0/nextjs-auth0'
import WellPermitTable from '../../components/widgets/DataTable/DataTable'
import MainContent, { Widget } from '../../components/MainContent'
import Header from '../../components/widgets/Header'
import WellPermitsAssignment from '../../components/widgets/WellPermitsAssignment/WellPermitsAssignment'
import WellPermitSearch from '../../components/widgets/WellPermitSearch/WellPermitSearch'
import { GetServerSideProps } from 'next'
import useSWR from 'swr'
import { Auth0AppMetadata } from '../../interfaces/Auth0UserProfile'
import { AppMetadata } from '../../interfaces/User'
import usePermitAssignments from '../../hooks/usePermitAssignments'


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
  const [permitRefs, setPermitRefs] = useState<AppMetadata['permitRefs']>()
  const permitAssignments = usePermitAssignments(permitRefs)

  useEffect(() => {
    if (!user || !user.app_metadata) return
    setPermitRefs(user.app_metadata.permitRefs)
  }, [user])

  const widgets: Widget[] = [
    { 
      component: <Header 
        title="Well Permits"
        subtitle="Manage well permits and access meter readings"
      />, 
      colspan: 3
    },
    { component: <WellPermitsAssignment rowData={permitAssignments} />, colspan: 3 },
    { component: <WellPermitSearch />, colspan: 3 }
  ]

  return (
    <MainContent widgets={widgets} columns={3} />
  )
}

export const getServerSideProps: GetServerSideProps = withPageAuthRequired()

WellPermits.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>
      {page}
    </AppLayout>
  )
}

export default WellPermits

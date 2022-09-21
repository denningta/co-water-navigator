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
import useSwr from 'swr'


const fetcher = async (url: string, user_id: string) => {
  const res = await fetch(url + '?user_id=' + user_id)
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
  // const { data } = usePermitAssignments(permitRefs)
  const { data } = useSwr(user ? `/api/v1/well-permits/${user.sub}` : null, fetcher)

  console.log(data)

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
    { component: <WellPermitsAssignment rowData={data} />, colspan: 3 },
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

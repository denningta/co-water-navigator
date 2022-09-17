import { Context, ReactElement } from 'react'
import AppLayout from '../../components/AppLayout'
import { NextPageWithLayout } from '../_app'
import { getServerSidePropsWrapper, getSession, UserProvider, useUser, withPageAuthRequired } from '@auth0/nextjs-auth0'
import WellPermitTable from '../../components/widgets/DataTable/DataTable'
import MainContent, { Widget } from '../../components/MainContent'
import Header from '../../components/widgets/Header'
import WellPermitsContainer from '../../components/widgets/WellPermitsAssignment/WellPermitsAssignment'
import WellPermitSearch from '../../components/widgets/WellPermitSearch/WellPermitSearch'
import PermitPreview from '../../components/widgets/PermitPreview'
import AgentDetails from '../../components/widgets/AgentDetails'
import { GetServerSideProps, NextApiRequest, NextApiResponse } from 'next'
import { AppContext } from 'next/app'

const Dashboard: NextPageWithLayout = () => {
  const { user } = useUser()

  const widgets: Widget[] = [
    { 
      component: <Header 
        title={`Hello, ${user && user.given_name}`}
        subtitle='Your wells at a glance'
      />, 
      colspan: 3
    },
    { component: <PermitPreview />, colspan: 2 },
    { component: <AgentDetails />, colspan: 1 }
  ]

  return (
    <MainContent widgets={widgets} columns={3} />
  )
}

export const getServerSideProps = withPageAuthRequired()


Dashboard.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>
      {page}
    </AppLayout>
  )
}

export default Dashboard

import { ReactElement, useEffect, useState } from 'react'
import AppLayout from '../../components/AppLayout'
import { NextPageWithLayout } from '../_app'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0'
import MainContent, { Widget } from '../../components/MainContent'
import Header from '../../components/widgets/Header'
import PermitPreview from '../../components/widgets/PermitPreview'
import AgentDetails from '../../components/widgets/AgentDetails'
import WellPermitsAssignment from '../../components/widgets/WellPermitsAssignment/WellPermitsAssignment'
import { tailwindBreakpoints } from '../../lib/tailwindcss/tailwindConfig'
import useTailwindBreakpoints from '../../hooks/useTailwindBreakpoints'

const Dashboard: NextPageWithLayout = () => {
  const { user } = useUser()
  const breakpoint = useTailwindBreakpoints()

  const widgets: Widget[] = [
    { 
      component: <Header 
        title={`Hello, ${user && user.given_name}`}
        subtitle='Your wells at a glance'
      />, 
      colspan: 3
    },
    { 
      component: <PermitPreview />, 
      colspan: breakpoint === 'sm' || breakpoint === 'md' ? 3 : 2 
    },
    { 
      component: <AgentDetails />, 
      colspan: breakpoint === 'sm' || breakpoint === 'md' ? 3 : 1 
    },
    { component: <WellPermitsAssignment />, colspan: 3 }
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

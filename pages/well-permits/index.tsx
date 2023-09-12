import { ReactElement } from 'react'
import AppLayout from '../../components/AppLayout'
import { NextPageWithLayout } from '../_app'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import MainContent, { Widget } from '../../components/MainContent'
import Header from '../../components/widgets/Header'
import WellPermitsAssignment from '../../components/widgets/WellPermitsAssignment/WellPermitsAssignment'
import { GetServerSideProps } from 'next'


const WellPermits: NextPageWithLayout = () => {


  const widgets: Widget[] = [
    {
      component: () => <Header
        title="Well Permits"
        subtitle="Manage well permits and access meter readings"
      />,
      colspan: 3
    },
    { component: () => <WellPermitsAssignment />, colspan: 3 },
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

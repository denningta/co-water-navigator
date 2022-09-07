import { ReactElement } from 'react'
import AppLayout from '../../components/AppLayout'
import { NextPageWithLayout } from '../_app'
import { getServerSidePropsWrapper, getSession, UserProvider } from '@auth0/nextjs-auth0'
import WellPermitTable from '../../components/widgets/WellPermitsTable/WellPermitTable'
import MainContent, { Widget } from '../../components/MainContent'
import Header from '../../components/widgets/Header'
import WellTablePermitsContainer from '../../components/widgets/WellPermitsContainer'
import WellPermitSearch from '../../components/widgets/WellPermitSearch/WellPermitSearch'
import { GetServerSideProps } from 'next'

const WellPermits: NextPageWithLayout = () => {

  const widgets: Widget[] = [
    { 
      component: <Header 
        title="Well Permits"
        subtitle="Manage well permits and access meter readings"
      />, 
      colspan: 3
    },
    { component: <WellTablePermitsContainer />, colspan: 3 },
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

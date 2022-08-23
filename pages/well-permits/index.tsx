import { ReactElement } from 'react'
import AppLayout from '../../components/AppLayout'
import { NextPageWithLayout } from '../_app'
import { UserProvider } from '@auth0/nextjs-auth0'
import WellPermitTable from '../../components/widgets/WellPermitTable'
import MainContent, { Widget } from '../../components/MainContent'
import Header from '../../components/widgets/Header'

const WellPermits: NextPageWithLayout = () => {

  const widgets: Widget[] = [
    { 
      component: <Header 
        title="Well Permits"
        subtitle="Manage well permits and access meter readings"
      />, 
      colspan: 3
    },
    { component: <WellPermitTable />, colspan: 3 },
  ]

  return (
    <MainContent widgets={widgets} columns={3} />
  )
}

WellPermits.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>
      {page}
    </AppLayout>
  )
}

export default WellPermits

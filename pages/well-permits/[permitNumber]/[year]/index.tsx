import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import AppLayout from '../../../../components/AppLayout'
import MainContent, { Widget } from '../../../../components/MainContent'
import Header from '../../../../components/widgets/Header'
import MeterReadingsComponent from '../../../../components/widgets/MeterReadings/MeterReadings'
import { NextPageWithLayout } from '../../../_app'


const WellPermit: NextPageWithLayout = () => {
  const { query } = useRouter()

  const widgets: Widget[] = [
    { 
      component: <Header 
        title={Array.isArray(query.permit) ? query.permit[0] : query.permit ?? 'Well Permit'}
        subtitle="Manage well permits and access meter readings"
      />, 
      colspan: 3
    },
    {
      component: <MeterReadingsComponent />,
      colspan: 3
    }
  ]

  return (
    <MainContent widgets={widgets} columns={3} />
  )
}

WellPermit.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>
      {page}
    </AppLayout>
  )
}

export default WellPermit

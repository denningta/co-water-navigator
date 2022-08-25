import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import AppLayout from '../../../../components/AppLayout'
import MainContent, { Widget } from '../../../../components/MainContent'
import Header from '../../../../components/widgets/Header'
import AdminReportSummary from '../../../../components/widgets/MeterReadings/ModifiedBankingSummary'
import CalendarYearSelector from '../../../../components/widgets/CalendarYearSelector/CalendarYearSelector'
import MeterReadingsComponent from '../../../../components/widgets/MeterReadings/MeterReadings'
import MeterReadingsHeader from '../../../../components/widgets/MeterReadings/MeterReadingsHeader'
import WellUsage from '../../../../components/widgets/MeterReadings/WellUsage'
import { NextPageWithLayout } from '../../../_app'


const WellPermit: NextPageWithLayout = () => {
  const { query } = useRouter()
  const permitNumber = Array.isArray(query.permitNumber) ? query.permitNumber[0] : query.permitNumber
  const widgets: Widget[] = [
    { 
      component: <MeterReadingsHeader permitNumber={permitNumber}/>, 
      colspan: 3
    },
    {
      component: <CalendarYearSelector />,
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

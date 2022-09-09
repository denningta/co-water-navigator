import { getServerSidePropsWrapper, getSession } from '@auth0/nextjs-auth0'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import useSWR from 'swr'
import AppLayout from '../../../../components/AppLayout'
import MainContent, { Widget } from '../../../../components/MainContent'
import CalendarYearSelector from '../../../../components/widgets/CalendarYearSelector/CalendarYearSelector'
import MeterReadingsComponent from '../../../../components/widgets/MeterReadings/MeterReadings'
import MeterReadingsHeader from '../../../../components/widgets/MeterReadings/MeterReadingsHeader'
import ModifiedBanking from '../../../../components/widgets/ModifiedBanking/ModifiedBanking'
import { NextPageWithLayout } from '../../../_app'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const WellPermit: NextPageWithLayout = () => {
  const router = useRouter()
  const { query } = router
  let permitNumber, year: string | undefined = undefined

  if (router.isReady) {
    permitNumber = Array.isArray(query.permitNumber) ? query.permitNumber[0] : query.permitNumber
    year = Array.isArray(query.year) ? query.year[0] : query.year
  }

  const meterReadings = useSWR(
    (permitNumber && year) 
    ? `/api/v1/meter-readings?permitNumber=${permitNumber}&year=${year}` 
    : null, 
    fetcher
  )

  const calendarYearSelector = useSWR(
    (permitNumber) 
    ? `/api/v1/data-summary?permitNumber=${permitNumber}` 
    : null, 
    fetcher
  )

  const modifiedBankingData = useSWR(
    (permitNumber && year)
    ? `/api/v1/modified-banking/${permitNumber}/${year}`
    : null,
    fetcher
  )

  const widgets: Widget[] = [
    { 
      component: <MeterReadingsHeader permitNumber={permitNumber}/>, 
      colspan: 3
    },
    {
      component: <CalendarYearSelector data={calendarYearSelector.data} />,
      colspan: 3
    },
    {
      component: <MeterReadingsComponent 
        meterReadings={meterReadings.data} permitNumber={permitNumber} year={year}   
      />,
      colspan: 3
    },
    {
      component: <ModifiedBanking modifiedBankingData={modifiedBankingData.data} permitNumber={permitNumber} year={year} />,
      colspan: 3
    }
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

WellPermit.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>
      {page}
    </AppLayout>
  )
}

export default WellPermit

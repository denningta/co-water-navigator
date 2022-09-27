import { getServerSidePropsWrapper, getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import useSWR from 'swr'
import AppLayout from '../../../components/AppLayout'
import MainContent, { Widget } from '../../../components/MainContent'
import CalendarYearSelector from '../../../components/widgets/CalendarYearSelector/CalendarYearSelector'
import MeterReadingsComponent from '../../../components/widgets/MeterReadings/MeterReadingsComponent'
import MeterReadingsHeader from '../../../components/widgets/MeterReadings/MeterReadingsHeader'
import ModifiedBanking from '../../../components/widgets/ModifiedBanking/ModifiedBankingForm'
import ModifiedBankingComponent from '../../../components/widgets/ModifiedBanking/ModifiedBankingComponent'
import { NextPageWithLayout } from '../../_app'
import { PermitRef } from '../../../interfaces/WellPermit'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    error.message = await res.json()
    throw error
  }
  return res.json()
}

const WellPermit: NextPageWithLayout = () => {
  const router = useRouter()
  const { query } = router
  let permitNumber: string | undefined = undefined
  const [year, setYear] = useState(new Date().getFullYear().toString())

  if (router.isReady) {
    permitNumber = Array.isArray(query.permitNumber) ? query.permitNumber[0] : query.permitNumber
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

  const handleYearChanged = (year: string) => {
    setYear(year)
  }

  const widgets: Widget[] = [
    { 
      component: <MeterReadingsHeader permitNumber={permitNumber}/>, 
      colspan: 3
    },
    {
      component: 
        <CalendarYearSelector 
        data={calendarYearSelector.data} 
        year={year} 
        onYearChanged={handleYearChanged} />,
      colspan: 3
    },
    {
      component: <MeterReadingsComponent 
        meterReadings={meterReadings.data} permitNumber={permitNumber} year={year}   
      />,
      colspan: 3
    },
    {
      component: <ModifiedBankingComponent 
        permitNumber={permitNumber} year={year} modifiedBankingData={modifiedBankingData.data} 
      />,
      colspan: 3
    }
    // {
    //   component: <ModifiedBanking 
    //     modifiedBankingData={
    //       !(modifiedBankingData.error) 
    //         ? modifiedBankingData.data
    //         : undefined 
    //     } 
    //     permitNumber={permitNumber} 
    //     year={year} />,
    //   colspan: 3
    // }
  ]

  return (
    <MainContent widgets={widgets} columns={3} />
  )
}

export const getServerSideProps: GetServerSideProps = getServerSidePropsWrapper(async ({ query, req, res}) => {
  const session = getSession(req, res)
  
  if (!query.permitNumber) return {
    redirect: { destination: '/500' },
    props: {}
  }

  const permitQuery = Array.isArray(query.permitNumber) ? query.permitNumber[0] : query.permitNumber
  const permitRefs: PermitRef[] | undefined = session?.user?.app_metadata?.permitRefs

  if (!session) 
    return { 
      redirect: { destination: '/api/auth/login' }, 
      props: {} 
    }

  if (!permitRefs) 
    return {
      redirect: { destination: '/well-permits/not-authorized' },
      props: {}
    }

  if (
    permitRefs.findIndex((permitRef) => 
      permitRef.permit === permitQuery
      && permitRef.status === 'approved'
    ) === -1
  ) 
    return {
      redirect: { destination: '/well-permits/not-authorized' },
      props: {
        test: 'test'
      }
    }  

  return {
    props: {}
  }
})

WellPermit.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>
      {page}
    </AppLayout>
  )
}

export default WellPermit

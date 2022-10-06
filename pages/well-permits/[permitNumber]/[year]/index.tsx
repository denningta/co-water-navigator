import { getServerSidePropsWrapper, getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import useSWR from 'swr'
import AppLayout from '../../../../components/AppLayout'
import MainContent, { Widget } from '../../../../components/MainContent'
import CalendarYearSelector from '../../../../components/widgets/CalendarYearSelector/CalendarYearSelector'
import MeterReadingsComponent from '../../../../components/widgets/MeterReadings/MeterReadingsComponent'
import MeterReadingsHeader from '../../../../components/widgets/MeterReadings/MeterReadingsHeader'
import ModifiedBankingComponent from '../../../../components/widgets/ModifiedBanking/ModifiedBankingComponent'
import { NextPageWithLayout } from '../../../_app'
import { PermitRef } from '../../../../interfaces/WellPermit'
import Footer from '../../../../components/common/Footer'
import { columnDefs } from '../../../../components/widgets/CalendarYearSelector/calendar-year-selector-coldefs'

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
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [permitNumber, setPermitNumber] = useState<string | undefined>(undefined)
  const [calculating, setCalculating] = useState<boolean | undefined>(undefined)

  useEffect(() => {    
    if (router.isReady) {
      setPermitNumber(Array.isArray(query.permitNumber) ? query.permitNumber[0] : query.permitNumber)
      setYear(Array.isArray(query.year) ? query.year[0] : query.year ?? new Date().getFullYear().toString())
    }
  }, [router, query])

  const calendarYearSelector = useSWR(
    (permitNumber) 
    ? `/api/v1/data-summary?permitNumber=${permitNumber}` 
    : null, 
    fetcher
  )


  const handleYearChanged = (year: string) => {
    setYear(year)
    router.push(`/well-permits/${permitNumber}/${year}`)
  }

  const widgets: Widget[] = [
    { 
      component: <MeterReadingsHeader 
        permitNumber={permitNumber}
        year={year}
      />, 
      colspan: 3
    },
    {
      component: 
        <CalendarYearSelector 
          permitNumber={permitNumber}
          year={year} 
          onYearChanged={handleYearChanged} 
        />,
      colspan: 3
    },
    {
      component: <MeterReadingsComponent 
        permitNumber={permitNumber} 
        year={year}   
        onCalculating={setCalculating}
      />,
      colspan: 3
    },
    {
      component: <ModifiedBankingComponent 
        permitNumber={permitNumber} 
        year={year} 
        onCalculating={setCalculating}
      />,
      colspan: 3
    }
  ]

  return (
    <>
      <div className='mb-6'>
        <MainContent widgets={widgets} columns={3} />
      </div>
      <Footer loading={calculating} />
    </>
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

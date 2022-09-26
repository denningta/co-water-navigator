import { getServerSidePropsWrapper, getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import useSWR from 'swr'
import AppLayout from '../../components/AppLayout'
import MainContent, { Widget } from '../../components/MainContent'
import CalendarYearSelector from '../../components/widgets/CalendarYearSelector/CalendarYearSelector'
import MeterReadingsComponent from '../../components/widgets/MeterReadings/MeterReadingsComponent'
import MeterReadingsHeader from '../../components/widgets/MeterReadings/MeterReadingsHeader'
import ModifiedBanking from '../../components/widgets/ModifiedBanking/ModifiedBankingForm'
import ModifiedBankingComponent from '../../components/widgets/ModifiedBanking/ModifiedBankingComponent'
import { NextPageWithLayout } from '../_app'
import { PermitRef } from '../../interfaces/WellPermit'
import Header from '../../components/widgets/Header'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    error.message = await res.json()
    throw error
  }
  return res.json()
}

const WellPermitNotAuthorized: NextPageWithLayout = () => {



  const widgets: Widget[] = [
    {
      component: 
        <Header 
          title="Not Authorized" 
          subtitle='You are not authorized to access this well permit number' 
        />,
      colspan: 3
    },
    {
      component: <GoBack />,
      colspan: 3
    }
  ]

  return (
    <MainContent widgets={widgets} columns={3} />
  )
}

const GoBack = () => {
  const router = useRouter()
  const handleClick = () => {
    router.push('/well-permits')
  }

  return (
    <div className='h-[400px] flex justify-center items-center'>
      <div className='text-center'>
        <div className='mb-4'>
          You are not authorized to access the well permit number you selected.
        </div>
        <button onClick={handleClick} className="bg-primary text-white px-3 py-2 rounded-lg">
          Back to Well Permits
        </button>
      </div>
    </div>
  )
}


WellPermitNotAuthorized.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>
      {page}
    </AppLayout>
  )
}

export default WellPermitNotAuthorized

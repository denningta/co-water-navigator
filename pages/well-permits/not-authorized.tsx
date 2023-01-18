import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import AppLayout from '../../components/AppLayout'
import MainContent, { Widget } from '../../components/MainContent'
import { NextPageWithLayout } from '../_app'
import Header from '../../components/widgets/Header'
import Button from '../../components/common/Button'
import Link from 'next/link'

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
      <div className='flex flex-col items-center'>
        <div className='mb-3'>
          You are not authorized to access the well permit number you selected.
        </div>
        <div className='mb-5 text-xs'>
          Note: you may need to <Link href="/api/auth/logout"><a className='text-primary-500 underline'>log out</a></Link> and log back in to update your authorization.
        </div>
        <Button title="Back to Well Permits" onClick={handleClick} />
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

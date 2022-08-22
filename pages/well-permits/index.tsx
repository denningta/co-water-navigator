import { ReactElement } from 'react'
import AppLayout from '../../components/AppLayout'
import { NextPageWithLayout } from '../_app'
import { UserProvider } from '@auth0/nextjs-auth0'

const WellPermits: NextPageWithLayout = () => {
  return (
      <div>WellPermits works</div>
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

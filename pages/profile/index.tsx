import type { NextPage } from 'next'
import { ReactElement } from 'react'
import AppLayout from '../../components/AppLayout'
import { NextPageWithLayout } from '../_app'

const Profile: NextPageWithLayout = () => {
  return (
      <div>profile works</div>
  )
}

Profile.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>
      {page}
    </AppLayout>
  )
}

export default Profile

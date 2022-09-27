import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import useSWR from 'swr'
import AppLayout from '../../../components/AppLayout'
import MainContent, { Widget } from '../../../components/MainContent'
import Header from '../../../components/widgets/Header'
import AdminProfileComponent from '../../../components/widgets/AdminProfile/AdminProfileComponent'
import { NextPageWithLayout } from '../../_app'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    error.message = await res.json()
    throw error
  }
  return res.json()
}

const UserDetailsPage: NextPageWithLayout = () => {
  const router = useRouter()
  const { user_id } = router.query

  const { data, isValidating, error } = useSWR(`/api/auth/${user_id}/get-user`, fetcher)

  const widgets: Widget[] = [
    { 
      component: <Header 
        title="User Details"
        subtitle="Manage user profile"
      />, 
      colspan: 3
    },
    {
      component: <AdminProfileComponent user={data} />,
      colspan: 3
    }
  ]

  return (
    <MainContent widgets={widgets} columns={3} />
  )
}

export const getServerSideProps = withPageAuthRequired()

UserDetailsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>
      {page}
    </AppLayout>
  )
}

export default UserDetailsPage

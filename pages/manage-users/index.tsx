import { getServerSidePropsWrapper, getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { User } from 'auth0'
import type { GetServerSideProps, NextPage } from 'next'
import { ReactElement } from 'react'
import useSWR from 'swr'
import AppLayout from '../../components/AppLayout'
import MainContent, { Widget } from '../../components/MainContent'
import Header from '../../components/widgets/Header'
import ProfileContainer from '../../components/widgets/UserProfile/UserProfileComponent'
import UserManager from '../../components/widgets/UsersManager/UserManager'
import { NextPageWithLayout } from '../_app'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    error.message = await res.json()
    throw error
  }
  return res.json()
}

const ManageUsers: NextPageWithLayout = () => {
  const users = useSWR('/api/auth/users', fetcher)


  const widgets: Widget[] = [
    { 
      component: <Header 
        title="Manage Users"
        subtitle="Assign permissions and manage access to well permits"
      />, 
      colspan: 3
    },
    {
      component: <UserManager users={users.data} />,
      colspan: 3
    }
  ]

  return (
    <MainContent widgets={widgets} columns={3} />
  )
}

export const getServerSideProps: GetServerSideProps = getServerSidePropsWrapper(async ({ query, req, res}) => {
  const session = getSession(req, res)
  const admin = (session?.user['coWaterExport/roles'] as string[]).includes('admin')

  if (admin) return {
    props: {}
  }

  return {
    redirect: { destination: '/not-authorized' },
    props: {}
  }
})

ManageUsers.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>
      {page}
    </AppLayout>
  )
}

export default ManageUsers

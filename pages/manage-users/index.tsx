import { getServerSidePropsWrapper, getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { User } from 'auth0'
import type { GetServerSideProps, NextPage } from 'next'
import { ReactElement } from 'react'
import useSWR from 'swr'
import AppLayout from '../../components/AppLayout'
import MainContent, { Widget } from '../../components/MainContent'
import Header from '../../components/widgets/Header'
import ProfileContainer from '../../components/widgets/Profile/ProfileContainer'
import UserManager from '../../components/widgets/UserManager/UserManager'
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

export const getServerSideProps = withPageAuthRequired()

ManageUsers.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>
      {page}
    </AppLayout>
  )
}

export default ManageUsers

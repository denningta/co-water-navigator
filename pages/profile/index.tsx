import { getServerSidePropsWrapper, getSession, useUser, withPageAuthRequired } from '@auth0/nextjs-auth0'
import type { GetServerSideProps, NextPage } from 'next'
import { ReactElement } from 'react'
import AppLayout from '../../components/AppLayout'
import MainContent, { Widget } from '../../components/MainContent'
import Header from '../../components/widgets/Header'
import ProfileContainer from '../../components/widgets/UserProfile/UserProfileComponent'
import { NextPageWithLayout } from '../_app'

const Profile: NextPageWithLayout = () => {
  const { user } = useUser()

  const widgets: Widget[] = [
    { 
      component: <Header 
        title="Well Permits"
        subtitle="Manage well permits and access meter readings"
      />, 
      colspan: 3
    },
    { component: <ProfileContainer user={user} />, colspan: 3 },
  ]

  return (
    <MainContent widgets={widgets} columns={3} />
  )
}

export const getServerSideProps = withPageAuthRequired()

Profile.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>
      {page}
    </AppLayout>
  )
}

export default Profile

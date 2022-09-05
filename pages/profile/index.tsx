import { getServerSidePropsWrapper, getSession } from '@auth0/nextjs-auth0'
import type { GetServerSideProps, NextPage } from 'next'
import { ReactElement } from 'react'
import AppLayout from '../../components/AppLayout'
import MainContent, { Widget } from '../../components/MainContent'
import Header from '../../components/widgets/Header'
import ProfileContainer from '../../components/widgets/Profile/ProfileContainer'
import { NextPageWithLayout } from '../_app'

const Profile: NextPageWithLayout = () => {
  const widgets: Widget[] = [
    { 
      component: <Header 
        title="Well Permits"
        subtitle="Manage well permits and access meter readings"
      />, 
      colspan: 3
    },
    { component: <ProfileContainer />, colspan: 3 },
  ]

  return (
    <MainContent widgets={widgets} columns={3} />
  )
}

export const getServerSideProps: GetServerSideProps = getServerSidePropsWrapper(async ({ req, res }) => {
  const session = getSession(req, res)
  if (!session || !session.user) {
    return { redirect: { destination: '/api/auth/login', permanent: false } }
  }
  return { props: { user: session.user } }
})

Profile.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>
      {page}
    </AppLayout>
  )
}

export default Profile

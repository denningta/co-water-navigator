
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { ReactElement } from 'react'
import AppLayout from '../../components/AppLayout'
import MainContent, { Widget } from '../../components/MainContent'
import Header from '../../components/widgets/Header'
import ReportIssueForm from '../../components/widgets/ReportIssue/ReportIssueForm'
import ProfileContainer from '../../components/widgets/UserProfile/UserProfileComponent'
import { NextPageWithLayout } from '../_app'

const Profile: NextPageWithLayout = () => {
  const { user } = useUser()

  const widgets: Widget[] = [
    {
      component: <Header
        title="Report an Issue"
        subtitle="Send the developer an actionable report on any issues or bugs you encounter"
      />,
      colspan: 3
    },
    { component: <ReportIssueForm />, colspan: 3 },
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

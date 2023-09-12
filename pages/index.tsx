import { getServerSidePropsWrapper, getSession, useUser } from '@auth0/nextjs-auth0'
import LandingPage from '../public-site/LandingPage';
import { NextPageWithLayout } from './_app';
import PublicLayout from '../public-site/PublicLayout';
import { GetServerSideProps } from 'next';

const Main: NextPageWithLayout = () => {

  return (
    <PublicLayout>
      <LandingPage />
    </PublicLayout>
  )
}

export const getServerSideProps: GetServerSideProps = getServerSidePropsWrapper(async ({ req, res }) => {
  const session = getSession(req, res)

  if (!session || !session.user) {
    return { props: {} }
  }

  return { redirect: { destination: '/dashboard', permanent: true } }
})

export default Main



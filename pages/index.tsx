import { getServerSidePropsWrapper, getSession, useUser } from '@auth0/nextjs-auth0'
import LandingPage from '../public-site/LandingPage';
import { NextPageWithLayout } from './_app';
import AppLayout from '../components/AppLayout';
import { GiWaterSplash } from 'react-icons/gi';
import PublicLayout from '../public-site/PublicLayout';
import MainContent, { Widget } from '../components/MainContent';
import Header from '../components/widgets/Header';
import PermitPreview from '../components/widgets/PermitPreview';
import AgentDetails from '../components/widgets/AgentDetails';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
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



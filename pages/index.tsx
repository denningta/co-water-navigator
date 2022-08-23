import { useUser } from '@auth0/nextjs-auth0'
import LandingPage from '../public-site/LandingPage';
import { NextPageWithLayout } from './_app';
import AppLayout from '../components/AppLayout';
import { GiWaterSplash } from 'react-icons/gi';
import PublicLayout from '../public-site/PublicLayout';
import MainContent, { Widget } from '../components/MainContent';
import Header from '../components/widgets/Header';
import PermitPreview from '../components/widgets/PermitPreview';
import AgentDetails from '../components/widgets/AgentDetails';

const Main: NextPageWithLayout = () => {
  const { user, error, isLoading } = useUser();

  const widgets: Widget[] = [
    { 
      component: <Header 
        title={`Hello${user && ', ' + user.given_name}`}
        subtitle='Your wells at a glance'
      />, 
      colspan: 3
    },
    { component: <PermitPreview />, colspan: 2 },
    { component: <AgentDetails />, colspan: 1 }
  ]

  return (
    <>
      {/* {isLoading && 
        <div className="flex justify-center items-center absolute w-full h-full p-4 text-6xl text-white bg-black">
          <div className='flex flex-col justify-center items-center animate-pulse'>
            <GiWaterSplash />
            <span className='text-lg'>Loading . . .</span>
          </div>
        </div>
      } */}
      {user && 
        <AppLayout>
          <MainContent columns={3} widgets={widgets} />
        </AppLayout>
      }
      {(!user && !isLoading) &&
        <PublicLayout>
          <LandingPage />
        </PublicLayout>
      }
    </>
  )
}

export default Main



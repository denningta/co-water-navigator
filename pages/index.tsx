import { useUser } from '@auth0/nextjs-auth0'
import { ReactElement } from 'react';
import Dashboard from '../components/Dashboard'
import LandingPage from '../components/LandingPage/LandingPage';
import Layout from '../components/AppLayout';
import { NextPageWithLayout } from './_app';
import AppLayout from '../components/AppLayout';
import { GiWaterSplash } from 'react-icons/gi';

const Main: NextPageWithLayout = () => {
  const { user, error, isLoading } = useUser();
  console.log(user)
  console.log(isLoading)
  return (
    <>
       
      {isLoading && 
        <div className="flex justify-center items-center absolute w-full h-full p-4 text-6xl text-white bg-black">
          <div className='flex flex-col justify-center items-center animate-pulse'>
            <GiWaterSplash />
            <span className='text-lg'>Loading . . .</span>
          </div>
        </div>
      }
      {user && 
      <AppLayout>
        <Dashboard />
      </AppLayout>
      }
      {(!user && !isLoading) &&
        <LandingPage />
      }
    </>
  )
}

export default Main



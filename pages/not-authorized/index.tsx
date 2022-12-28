import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import AppLayout from '../../components/AppLayout'
import MainContent, { Widget } from '../../components/MainContent'
import { NextPageWithLayout } from '../_app'
import Header from '../../components/widgets/Header'
import Button from '../../components/common/Button'


const NotAuthorized: NextPageWithLayout = () => {
  const widgets: Widget[] = [
    {
      component: 
        <Header 
          title="Not Authorized" 
          subtitle='You are not authorized to access this resource' 
        />,
      colspan: 3
    },
    {
      component: <GoBack />,
      colspan: 3
    }
  ]

  return (
    <MainContent widgets={widgets} columns={3} />
  )
}

const GoBack = () => {
  const router = useRouter()
  const handleClick = () => {
    router.push('/')
  }

  return (
    <div className='h-[400px] flex justify-center items-center'>
      <div className='flex flex-col items-center'>
        <div className='mb-4'>
          You are not authorized to access this resource.
        </div>
        <Button title="Home" onClick={handleClick} />
      </div>
    </div>
  )
}


NotAuthorized.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>
      {page}
    </AppLayout>
  )
}

export default NotAuthorized

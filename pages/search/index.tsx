import { ReactElement, useEffect, useState } from 'react'
import AppLayout from '../../components/AppLayout'
import { NextPageWithLayout } from '../_app'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import MainContent, { Widget } from '../../components/MainContent'
import Header from '../../components/widgets/Header'
import WellPermitSearch from '../../components/widgets/WellPermitSearch/WellPermitSearch'
import { GetServerSideProps } from 'next'



const Search: NextPageWithLayout = () => {

  const widgets: Widget[] = [
    {
      component: () => {
        return (
          <Header
            title="Search for Well Permits"
            subtitle="Search and request access to well permits"
          />
        )
      },
      colspan: 3
    },
    {
      component: () => {
        return (
          <WellPermitSearch />
        )
      },
      colspan: 3
    },
  ]

  return (
    <MainContent widgets={widgets} columns={3} />
  )
}

export const getServerSideProps: GetServerSideProps = withPageAuthRequired()

Search.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>
      {page}
    </AppLayout>
  )
}

export default Search

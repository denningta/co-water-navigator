import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import { GetServerSideProps } from "next"
import { ReactElement } from "react"
import AppLayout from "../../components/AppLayout"
import MainContent, { Widget } from "../../components/MainContent"
import ExportComponent from "../../components/widgets/Export/ExportComponent"
import Header from "../../components/widgets/Header"
import { NextPageWithLayout } from "../_app"


const fetcher = async (url: string, user_id: string) => {
  const res = await fetch(url + '?user_id=' + user_id)
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    error.message = await res.json()
    throw error
  }
  return res.json()
}

const WellPermits: NextPageWithLayout = () => {

  const widgets: Widget[] = [
    {
      component: () => <Header
        title="Export Data"
        subtitle="Export Colorado Ground Water Resources Forms"
      />,
      colspan: 3
    },
    { component: () => <ExportComponent />, colspan: 3 },
  ]

  return (
    <MainContent widgets={widgets} columns={3} />
  )
}

export const getServerSideProps: GetServerSideProps = withPageAuthRequired()

WellPermits.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>
      {page}
    </AppLayout>
  )
}

export default WellPermits

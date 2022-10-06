import { getServerSidePropsWrapper } from "@auth0/nextjs-auth0";
import { GetServerSideProps } from "next";
import { NextPageWithLayout } from "../../_app";

const Main: NextPageWithLayout = () => {

  return (
    <div></div>
  )
}

export const getServerSideProps: GetServerSideProps = 
  getServerSidePropsWrapper(async ({ query }) => {
    const { permitNumber } = query
    return { 
      redirect: { 
        destination: `/well-permits/${permitNumber}/${new Date().getFullYear().toString()}`, 
        permanent: true
      } 
    }
  })

export default Main

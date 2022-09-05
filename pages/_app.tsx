import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { UserProvider, useUser } from '@auth0/nextjs-auth0'
import Layout from '../components/AppLayout'
import { NextPage } from 'next'
import { JSXElementConstructor, ReactElement, ReactNode, useEffect, useState } from 'react'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return getLayout(
    <UserProvider>
        <Component {...pageProps} />
    </UserProvider>
  )
}

export default MyApp


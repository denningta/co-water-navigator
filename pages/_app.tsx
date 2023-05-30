import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { UserProvider } from '@auth0/nextjs-auth0'
import { NextPage } from 'next'
import { ReactElement, ReactNode } from 'react'
import { SnackbarProvider } from 'notistack'
import ConfirmationDialogProvider from '../components/common/ConfirmationDialogProvider'

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
      <SnackbarProvider
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <ConfirmationDialogProvider>
          <Component {...pageProps} />
        </ConfirmationDialogProvider>
      </SnackbarProvider>
    </UserProvider>
  )
}

export default MyApp


import Head from 'next/head'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import LoadingIndicator from '_components/LoadingIndicator'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Silicon Jungles Alumni" />
      </Head>
      <LoadingIndicator />
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp

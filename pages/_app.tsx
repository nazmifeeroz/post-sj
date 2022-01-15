import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import LoadingIndicator from '_components/LoadingIndicator'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <LoadingIndicator />
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp

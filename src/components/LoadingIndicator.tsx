import { useEffect, useState } from 'react'
import { Box, Spinner } from '@chakra-ui/react'
import { useRouter } from 'next/router'

const LoadingIndicator = () => {
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    router.events.on('routeChangeStart', () => setIsRedirecting(true))
    router.events.on('routeChangeComplete', () => setIsRedirecting(false))
  }, [router])

  if (!isRedirecting) return null

  return (
    <Box
      borderRadius="md"
      boxShadow="md"
      bg="teal"
      color="white"
      px={2}
      h={6}
      w={7}
      position="fixed"
      top="2"
      right="4"
    >
      <Spinner size="xs" />
    </Box>
  )
}

export default LoadingIndicator

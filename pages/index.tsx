import React from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Stack,
  Text,
} from '@chakra-ui/react'

const Home: NextPage = () => {
  const router = useRouter()

  return (
    <Container maxW="container.xl" mb="5">
      <Center h="100vh">
        <Flex direction="column" align="center">
          <div>
            <Text
              bgGradient="linear(to-r, teal.500, green.500)"
              bgClip="text"
              fontSize="6xl"
              fontWeight="extrabold"
            >
              Alumni
            </Text>
          </div>
          <div>
            <Stack direction="row" spacing={4} align="center">
              <Button
                colorScheme="teal"
                variant="ghost"
                onClick={() => router.push('/shares')}
              >
                Shares
              </Button>
              <Button colorScheme="teal" variant="ghost">
                Pairs
              </Button>
              <Button colorScheme="teal" variant="ghost">
                Help
              </Button>
            </Stack>
          </div>
        </Flex>
      </Center>
    </Container>
  )
}

export default Home

import { useEffect } from 'react'
import type { NextPage } from 'next'
import { NextRouter, useRouter } from 'next/router'
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Image,
  Stack,
  Text,
} from '@chakra-ui/react'
import { assign, createMachine } from 'xstate'
import { useMachine } from '@xstate/react'

type machineContext = {
  router: NextRouter
}

type redirectPaths = 'SHARES' | 'PAIRS' | 'HELP'

type machineEvents =
  | { type: 'LOAD_ROUTER'; router: NextRouter }
  | { type: 'ON_REDIRECT'; redirect: redirectPaths }

const indexMachine = createMachine<machineContext, machineEvents>({
  id: 'indexMachine',
  initial: 'LOADING',
  states: {
    LOADING: {
      on: {
        LOAD_ROUTER: {
          target: 'IDLE',
          actions: assign({
            router: (_ctx, event) => {
              return event.router
            },
          }),
        },
      },
    },
    IDLE: {
      on: {
        ON_REDIRECT: [
          {
            target: 'REDIRECTING_SHARES',
            cond: (_ctx, e) => e.redirect === 'SHARES',
          },
          {
            target: 'REDIRECTING_PAIRS',
            cond: (_ctx, e) => e.redirect === 'PAIRS',
          },
          {
            target: 'REDIRECTING_HELP',
            cond: (_ctx, e) => e.redirect === 'HELP',
          },
        ],
      },
    },
    REDIRECTING_SHARES: {
      entry: (ctx) => ctx.router.push('/shares'),
    },
    REDIRECTING_PAIRS: {
      entry: (ctx) => ctx.router.push('/pairs'),
    },
    REDIRECTING_HELP: {
      entry: (ctx) => ctx.router.push('/help'),
    },
  },
})

const Home: NextPage = () => {
  const router = useRouter()
  const [current, send] = useMachine(indexMachine)

  useEffect(() => {
    if (router) send('LOAD_ROUTER', { router })
  }, [router, send])

  return (
    <Container maxW="container.xl" mb="5">
      <Center h="100vh">
        <Flex direction="column" align="center">
          <Image
            width="300px"
            src="/Silicon-Jungles-Logo.svg"
            alt="Silicon Jungles"
          />
          <div>
            <Stack direction="row" spacing={4} align="center">
              <Button
                isLoading={current.matches('REDIRECTING_SHARES')}
                loadingText="Shares"
                colorScheme="orange"
                variant="ghost"
                onClick={() => send('ON_REDIRECT', { redirect: 'SHARES' })}
                disabled={!current.matches('IDLE')}
              >
                Shares
              </Button>
              <Button
                isLoading={current.matches('REDIRECTING_PAIRS')}
                loadingText="Pairs"
                disabled={!current.matches('IDLE')}
                colorScheme="teal"
                variant="ghost"
                onClick={() => send('ON_REDIRECT', { redirect: 'PAIRS' })}
              >
                Pairs
              </Button>
              <Button
                isLoading={current.matches('REDIRECTING_HELP')}
                loadingText="Help"
                disabled={!current.matches('IDLE')}
                colorScheme="cyan"
                variant="ghost"
                onClick={() => send('ON_REDIRECT', { redirect: 'HELP' })}
              >
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

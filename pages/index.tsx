import React from 'react'
import type { NextPage } from 'next'
import { Container } from '@chakra-ui/react'
import DataTable from '_components/DataTable'
import fetchSharesDB from '_lib/shares'
import { shares } from '@prisma/client'
import { dehydrate, Hydrate, QueryClient } from 'react-query'

interface HomeProps {
  initialPageSize: number
  dehydratedState: QueryClient
}

const Home: NextPage<HomeProps> = ({ initialPageSize, dehydratedState }) => {
  // const shares = React.useMemo(() => data, [data])

  const columns = React.useMemo(
    () => [
      {
        Header: 'Contributor',
        accessor: 'contributor',
      },
      {
        Header: 'Sharing',
        accessor: 'sharing',
      },
      {
        Header: 'Created At',
        accessor: 'created_at',
      },
    ],
    []
  )

  return (
    <Container maxW="container.xl" mb="5">
      <Hydrate state={dehydratedState}>
        <DataTable
          columns={columns}
          initialPageSize={initialPageSize}
          // data={shares}
          // paginationOptions={{
          //   pageCount: paginationOptions.pageCount,
          //   pageSize: paginationOptions.initialPageSize,
          // }}
        />
      </Hydrate>
    </Container>
  )
}

export async function getStaticProps() {
  const initialPageSize = 20

  const queryClient = new QueryClient()
  await queryClient.prefetchQuery('shares', () =>
    fetchSharesDB(initialPageSize)
  )

  return {
    props: {
      initialPageSize,
      dehydratedState: dehydrate(queryClient),
    },
  }
}

export default Home

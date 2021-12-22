import React, { useEffect } from 'react'
import type { NextPage } from 'next'
import { Container } from '@chakra-ui/react'
import DataTable from '_components/DataTable'
import fetchSharesDB from '_lib/shares'
import { shares } from '@prisma/client'

interface HomeProps {
  data: shares[]
  paginationOptions: {
    pageCount: number
    initialPageSize: number
  }
}

const Home: NextPage<HomeProps> = ({ data, paginationOptions }) => {
  const shares = React.useMemo(() => data, [data])

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

  if (!data) return null

  return (
    <Container maxW="container.xl" mb="5">
      <DataTable
        columns={columns}
        data={shares}
        paginationOptions={{
          pageCount: paginationOptions.pageCount,
          pageSize: paginationOptions.initialPageSize,
        }}
      />
    </Container>
  )
}

export async function getStaticProps() {
  const { data, pageCount, initialPageSize } = await fetchSharesDB()

  return {
    props: {
      paginationOptions: {
        initialPageSize,
        pageCount: data && Math.ceil(pageCount / initialPageSize),
      },
      data,
    },
  }
}

export default Home

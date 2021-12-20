import React, { useEffect } from 'react'
import type { NextPage } from 'next'
import { Container } from '@chakra-ui/react'
import DataTable from '_components/DataTable'
import { FetchSharesResponse } from './api/shares'

const Home: NextPage = () => {
  const [shares, setShares] = React.useState<FetchSharesResponse | null>(null)
  useEffect(() => {
    fetch('/api/shares')
      .then((resp) => resp.json())
      .then(setShares)
  }, [])

  const data = React.useMemo(() => shares && shares.data, [shares])

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
        data={data}
        paginationOptions={{
          pageCount: shares?.pageCount,
          pageSize: shares?.initialPageSize,
        }}
      />
    </Container>
  )
}

export default Home

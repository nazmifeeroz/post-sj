import { useMemo } from 'react'
import { GetServerSideProps, NextPage } from 'next'
import { Container } from '@chakra-ui/react'
import fetchSharesDB, { FetchSharesResponse } from '_lib/shares'
import DataTable from '_components/DataTable'
import PageTabs from '_components/PageTabs'

type PageProps = {
  pageSize: number
  data: FetchSharesResponse
  containsQuery: string | null
}

const SharesPage: NextPage<PageProps> = ({ containsQuery, data, pageSize }) => {
  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
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
        accessor: 'formatted_created_at',
      },
    ],
    []
  )

  const tableData = useMemo(() => data, [data])

  return (
    <PageTabs active="shares">
      <Container maxW="container.xl" mb="5">
        <DataTable
          tableData={tableData}
          columns={columns}
          containsQuery={containsQuery}
          pageSize={pageSize}
          tableName="shares"
        />
      </Container>
    </PageTabs>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const page = context.query?.page || 1

  const pageSize = context.query.pageSize || 20

  const containsQuery = context.query.containsQuery
    ? `${context.query.containsQuery}`
    : null

  const data = await fetchSharesDB(+pageSize, +page, containsQuery).then(
    ({ data, ...rest }) => ({
      ...rest,
      data: data.map(
        ({ created_at, updated_at, created_at_day, ...rest }) => rest
      ),
    })
  )

  return {
    props: {
      data,
      pageSize,
      containsQuery,
    },
  }
}

export default SharesPage

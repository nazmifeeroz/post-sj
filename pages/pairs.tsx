import { useMemo } from 'react'
import { GetServerSideProps, NextPage } from 'next'
import { Container } from '@chakra-ui/react'
import fetchPairsDB, { FetchPairsResponse } from '_lib/pairs'
import DataTable from '_components/DataTable'
import PageTabs from '_components/PageTabs'

type PageProps = {
  pageSize: number
  data: FetchPairsResponse
}

const PairsPage: NextPage<PageProps> = ({ data, pageSize }) => {
  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Project',
        accessor: 'project',
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
    <PageTabs active="pairs">
      <Container maxW="container.xl" mb="5">
        <DataTable
          tableData={tableData}
          columns={columns}
          pageSize={pageSize}
          tableName="pairs"
        />
      </Container>
    </PageTabs>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const page = context.query?.page || 1

  const pageSize = context.query.pageSize || 20

  const data = await fetchPairsDB(+pageSize, +page).then(
    ({ data, ...rest }) => ({
      ...rest,
      data: data.map(({ created_at, updated_at, ...rest }) => rest),
    })
  )

  return {
    props: {
      data,
      pageSize,
    },
  }
}

export default PairsPage

import React from 'react'
import prisma from 'lib/prisma'
import type { NextPage } from 'next'
import { Table, Thead, Tbody, Tr, Th, Td, chakra } from '@chakra-ui/react'
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import { shares } from '@prisma/client'
import { useTable, useSortBy, Column } from 'react-table'

interface TypedTableProps {
  columns: Array<Column<object>>
  data: Array<object>
}

const DataTable: React.FC<TypedTableProps> = ({ columns, data }) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy)

  const firstPageRows = rows.slice(0, 20)

  return (
    <Table {...getTableProps()}>
      <Thead>
        {headerGroups.map((headerGroup, i) => (
          <Tr {...headerGroup.getHeaderGroupProps()} key={`header-${i}`}>
            {headerGroup.headers.map((column, col_i) => (
              <Th
                {...column.getHeaderProps(column.getSortByToggleProps())}
                key={`col-${col_i}`}
              >
                {column.render('Header')}
                <chakra.span pl="4" key={`span-${col_i}`}>
                  {column.isSorted ? (
                    column.isSortedDesc ? (
                      <TriangleDownIcon aria-label="sorted descending" />
                    ) : (
                      <TriangleUpIcon aria-label="sorted ascending" />
                    )
                  ) : null}
                </chakra.span>
              </Th>
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody {...getTableBodyProps()}>
        {firstPageRows.map((row, i) => {
          prepareRow(row)
          return (
            <Tr {...row.getRowProps()} key={`row-${i}`}>
              {row.cells.map((cell, cell_i) => (
                <Td {...cell.getCellProps()} key={`cell=${cell_i}`}>
                  {cell.render('Cell')}
                </Td>
              ))}
            </Tr>
          )
        })}
      </Tbody>
    </Table>
  )
}

interface HomeProps {
  shares: Array<object>
}

const Home: NextPage<HomeProps> = (props) => {
  const data = React.useMemo(() => props.shares, [props.shares])

  //   {
  //     "": "https://chrisseaton.com/truffleruby/ruby-stm/",
  //     "user_id": "auth0|5d5328f914af150d440980d8",
  //     "id": 2603,
  //     "": "Thu Oct 29 2020 10:04:11 GMT+0800 (Singapore Standard Time)",
  //     "updated_at": "Thu Oct 29 2020 10:04:11 GMT+0800 (Singapore Standard Time)",
  //     "": "Graf",
  //     "message_id": null,
  //     "created_at_day": "Thu Oct 29 2020 08:00:00 GMT+0800 (Singapore Standard Time)"
  // }
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
      // {
      //   Header: 'Created At',
      //   accessor: 'created_at',
      // },
    ],
    []
  )

  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}

export async function getStaticProps() {
  let data = null

  if (prisma) {
    const response = (await prisma.shares.findMany()) as shares[]

    data = response.map((re) => ({
      ...re,
      created_at: re.created_at && new Date(re.created_at).toString(),
      updated_at: re.updated_at && new Date(re.updated_at).toString(),
      created_at_day:
        re.created_at_day && new Date(re.created_at_day).toString(),
    }))
  }

  return {
    props: {
      some: 'stuff',
      shares: data,
    },
  }
}

export default Home

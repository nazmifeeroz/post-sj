import React from 'react'
import prisma from 'lib/prisma'
import type { NextPage } from 'next'
import { PrismaPromise, shares } from '@prisma/client'
import { usePagination, useTable, useSortBy, Column } from 'react-table'
import {
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  ButtonGroup,
  Box,
  IconButton,
  Input,
  Select,
  Flex,
  InputGroup,
  InputLeftAddon,
  SlideFade,
} from '@chakra-ui/react'
import {
  ArrowBackIcon,
  ArrowForwardIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  TriangleDownIcon,
  TriangleUpIcon,
} from '@chakra-ui/icons'

interface PaginationOptions {
  initialPageSize: number
  pageCount: number
}

interface TypedTableProps {
  columns: Array<Column<object>>
  data: Array<object>
  paginationOptions: PaginationOptions
}

const DataTable: React.FC<TypedTableProps> = ({
  columns,
  data,
  paginationOptions,
}) => {
  const {
    gotoPage,
    canPreviousPage,
    canNextPage,
    setPageSize,
    getTableProps,
    nextPage,
    pageCount,
    previousPage,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        pageSize: paginationOptions.initialPageSize,
      },
      manualPagination: true,
      pageCount: paginationOptions.pageCount,
    },
    useSortBy,
    usePagination
  )

  return (
    <SlideFade in={true} offsetY="60px">
      <Table {...getTableProps()} size="sm">
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
          {page.map((row, i) => {
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
      <Flex justifyContent="space-between" mt="4">
        <Box>
          <ButtonGroup size="sm">
            <IconButton
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
              aria-label="first page"
              icon={<ArrowLeftIcon />}
            />
            <IconButton
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              aria-label="previous"
              icon={<ArrowBackIcon />}
            />
            <IconButton
              onClick={() => nextPage()}
              disabled={!canNextPage}
              aria-label="next"
              icon={<ArrowForwardIcon />}
            />
            <IconButton
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
              aria-label="last page"
              icon={<ArrowRightIcon />}
            />
          </ButtonGroup>
        </Box>
        <Box display="flex">
          <InputGroup w="200px" size="sm">
            <InputLeftAddon>Go to page:</InputLeftAddon>
            <Input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0
                gotoPage(page)
              }}
            />
          </InputGroup>
          <Box ml="2" w="150px">
            <label>
              <Select
                size="sm"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                }}
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </Select>
            </label>
          </Box>
        </Box>
      </Flex>
    </SlideFade>
  )
}

interface HomeProps {
  shares: Array<object>
  paginationOptions: PaginationOptions
}

const Home: NextPage<HomeProps> = (props) => {
  const data = React.useMemo(() => props.shares, [props.shares])

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
      <DataTable
        columns={columns}
        data={data}
        paginationOptions={props.paginationOptions}
      />
    </Container>
  )
}

interface FetchResponse {
  data: null | Array<object>
  pageCount: number
}

const fetchData = async (): Promise<FetchResponse> => {
  let data = null
  let pageCount = 0

  if (prisma) {
    const prismaPromises: [PrismaPromise<number>, PrismaPromise<shares[]>] = [
      prisma.shares.count(),
      prisma.shares.findMany({
        take: 20,
        orderBy: {
          created_at: 'desc',
        },
      }),
    ]

    const [pageCountResponse, sharesData] = await prisma.$transaction(
      prismaPromises
    )
    pageCount = pageCountResponse

    data = sharesData.map((re) => {
      const parsedDate =
        re.created_at && new Date(re.created_at).toLocaleDateString()
      const parsedTime =
        re.created_at && new Date(re.created_at).toLocaleTimeString()

      return {
        ...re,
        created_at: `${parsedDate} ${parsedTime}`,
        updated_at: re.updated_at && new Date(re.updated_at).toString(),
        created_at_day:
          re.created_at_day && new Date(re.created_at_day).toString(),
      }
    })
  }

  return { data, pageCount }
}

export async function getStaticProps() {
  const INITIAL_PAGE_SIZE = 20

  const { data, pageCount } = await fetchData()

  return {
    props: {
      paginationOptions: {
        initialPageSize: INITIAL_PAGE_SIZE,
        pageCount: data && Math.ceil(pageCount / INITIAL_PAGE_SIZE),
      },
      shares: data,
    },
  }
}

export default Home

import { useEffect, useRef } from 'react'
import { usePagination, useTable, useSortBy, Column } from 'react-table'
import { FetchSharesResponse } from '_lib/shares'
import {
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
  InputRightElement,
} from '@chakra-ui/react'
import {
  ArrowBackIcon,
  ArrowForwardIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  TriangleDownIcon,
  TriangleUpIcon,
} from '@chakra-ui/icons'
import { useRouter } from 'next/router'
import Linkify from './Linkify'
import { FetchPairsResponse } from '_lib/pairs'
import { FetchHelpResponse } from '_lib/help'

type TableNames = 'shares' | 'pairs' | 'help'

interface TypedTableProps {
  columns: Array<Column<object>>
  pageSize: number
  tableData: FetchSharesResponse | FetchPairsResponse | FetchHelpResponse
  tableName: TableNames
}

const DataTable: React.FC<TypedTableProps> = ({
  columns,
  pageSize,
  tableData,
  tableName,
}) => {
  const {
    canPreviousPage,
    canNextPage,
    getTableProps,
    pageCount,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
  } = useTable(
    {
      columns,
      data: tableData.data,
      initialState: {
        pageIndex: tableData.page - 1,
        pageSize,
      },
      manualPagination: true,
      pageCount: tableData.pageCount,
    },
    useSortBy,
    usePagination
  )

  const router = useRouter()
  const pageRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    router.events.on('routeChangeComplete', () => {
      if (pageRef.current) pageRef.current.value = String(tableData.page)
    })
  }, [pageRef, router, tableData])

  const gotoPage = (p: number) =>
    router.push(`/${tableName}?page=${p + 1}&pageSize=${pageSize}`)
  const nextPage = () =>
    router.push(`/${tableName}?page=${tableData.page + 1}&pageSize=${pageSize}`)
  const setPageSize = (s: number) =>
    router.push(`/${tableName}?page=${tableData.page}&pageSize=${s}`)
  const previousPage = () =>
    router.push(`/${tableName}?page=${tableData.page - 1}&pageSize=${pageSize}`)

  return (
    <SlideFade in={true} offsetY="60px">
      <Flex
        direction={['column', 'row']}
        alignItems="center"
        justifyContent="space-between"
        mt="4"
        mb="4"
      >
        <Box>
          <ButtonGroup size="sm" mb={['4', '0']}>
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
              defaultValue={tableData.page}
              ref={pageRef}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0
                gotoPage(page)
              }}
            />
            <InputRightElement width="4rem">
              of {tableData.pageCount}{' '}
            </InputRightElement>
          </InputGroup>
          <Box ml="2" w="120px">
            <label>
              <Select
                size="sm"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                }}
              >
                {[10, 20, 30, 40, 50].map((size) => (
                  <option key={size} value={size}>
                    Show {size}
                  </option>
                ))}
              </Select>
            </label>
          </Box>
        </Box>
      </Flex>
      <Box maxW="100vw" overflow="scroll">
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
            {page.map((row, i) => {
              prepareRow(row)
              return (
                <Tr {...row.getRowProps()} key={`row-${i}`}>
                  {row.cells.map((cell, cell_i) => (
                    <Td {...cell.getCellProps()} key={`cell=${cell_i}`}>
                      {/* @ts-ignore */}
                      {cell.render(({ value }) => {
                        return <Linkify textChild={value} />
                      })}
                    </Td>
                  ))}
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </Box>
    </SlideFade>
  )
}

export default DataTable

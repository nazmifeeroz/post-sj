import { usePagination, useTable, useSortBy, Column } from 'react-table'
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
  pageCount: number | undefined
  pageSize: number | undefined
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
        pageSize: paginationOptions.pageSize,
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

export default DataTable

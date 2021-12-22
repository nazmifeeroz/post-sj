import { PrismaPromise, shares } from '@prisma/client'
import prisma from 'lib/prisma'

export interface FetchSharesResponse {
  data: null | Array<object>
  pageCount: number
  initialPageSize: number
}

export default async function fetchSharesDB() {
  let data = null
  let pageCount = 0
  const initialPageSize = 20

  if (prisma) {
    const prismaPromises: [PrismaPromise<number>, PrismaPromise<shares[]>] = [
      prisma.shares.count(),
      prisma.shares.findMany({
        take: initialPageSize,
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

  return { data, pageCount, initialPageSize }
}

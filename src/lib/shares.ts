import { PrismaPromise, shares } from '@prisma/client'
import prisma from 'lib/prisma'

export interface FetchSharesResponse {
  data: shares[]
  pageCount: number
  page: number
}

export default async function fetchSharesDB(
  pageSize: number,
  page: number
): Promise<FetchSharesResponse> {
  let data: shares[] = []
  let pageCount = 0

  if (prisma) {
    const prismaPromises: [PrismaPromise<number>, PrismaPromise<shares[]>] = [
      prisma.shares.count(),
      prisma.shares.findMany({
        take: pageSize,
        skip: pageSize * (page - 1),
        orderBy: {
          created_at: 'desc',
        },
      }),
    ]

    const [sharesCount, sharesData] = await prisma.$transaction(prismaPromises)
    pageCount = Math.ceil(sharesCount / pageSize)

    data = sharesData.map((re) => {
      const parsedDate = new Date(re.created_at!).toLocaleDateString()
      const parsedTime = new Date(re.created_at!).toLocaleTimeString()

      return {
        ...re,
        formatted_created_at: `${parsedDate} ${parsedTime}`,
      }
    })
  }

  return { data, pageCount, page }
}

import { PrismaPromise, pairs } from '@prisma/client'
import prisma from 'adaptors/prisma'

export interface FetchPairsResponse {
  data: pairs[]
  pageCount: number
  page: number
}

export default async function fetchPairsDB(
  pageSize: number,
  page: number
): Promise<FetchPairsResponse> {
  let data: pairs[] = []
  let pageCount = 0

  if (prisma) {
    const prismaPromises: [PrismaPromise<number>, PrismaPromise<pairs[]>] = [
      prisma.pairs.count(),
      prisma.pairs.findMany({
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

import { PrismaPromise, pairs } from '@prisma/client'
import prisma from 'adaptors/prisma'

export interface FetchPairsResponse {
  data: pairs[]
  pageCount: number
  page: number
}

export default async function fetchPairsDB(
  pageSize: number,
  page: number,
  containsQuery?: string | null
): Promise<FetchPairsResponse> {
  let data: pairs[] = []
  let pageCount = 0

  if (prisma) {
    const prismaPromises: [PrismaPromise<number>, PrismaPromise<pairs[]>] = [
      prisma.pairs.count(
        containsQuery
          ? {
              where: {
                project: {
                  contains: containsQuery,
                  mode: 'insensitive',
                },
              },
            }
          : undefined
      ),
      prisma.pairs.findMany({
        take: pageSize,
        skip: pageSize * (page - 1),
        orderBy: {
          created_at: 'desc',
        },
        ...(containsQuery && {
          where: {
            project: {
              contains: containsQuery,
              mode: 'insensitive',
            },
          },
        }),
      }),
    ]

    const [pairsCount, pairsData] = await Promise.all(prismaPromises)
    pageCount = Math.ceil(pairsCount / pageSize)

    data = pairsData.map((re) => {
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

import { PrismaPromise, shares } from '@prisma/client'
import prisma from 'adaptors/prisma'

export interface FetchSharesResponse {
  data: shares[]
  pageCount: number
  page: number
}

export default async function fetchSharesDB(
  pageSize: number,
  page: number,
  containsQuery?: string | null
): Promise<FetchSharesResponse> {
  let data: shares[] = []
  let pageCount = 0

  if (prisma) {
    const prismaPromises: [PrismaPromise<number>, PrismaPromise<shares[]>] = [
      prisma.shares.count(
        containsQuery
          ? {
              where: {
                OR: [
                  {
                    contributor: {
                      contains: containsQuery,
                      mode: 'insensitive',
                    },
                  },
                  {
                    sharing: {
                      contains: containsQuery,
                      mode: 'insensitive',
                    },
                  },
                ],
              },
            }
          : undefined
      ),
      prisma.shares.findMany({
        take: pageSize,
        skip: pageSize * (page - 1),
        orderBy: {
          created_at: 'desc',
        },
        ...(containsQuery && {
          where: {
            OR: [
              {
                contributor: {
                  contains: containsQuery,
                  mode: 'insensitive',
                },
              },
              {
                sharing: {
                  contains: containsQuery,
                  mode: 'insensitive',
                },
              },
            ],
          },
        }),
      }),
    ]

    const [sharesCount, sharesData] = await Promise.all(prismaPromises)
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

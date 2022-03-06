import { PrismaPromise, assistance } from '@prisma/client'
import prisma from 'adaptors/prisma'

export interface FetchHelpResponse {
  data: assistance[]
  pageCount: number
  page: number
}

export default async function fetchHelpDB(
  pageSize: number,
  page: number,
  containsQuery?: string | null
): Promise<FetchHelpResponse> {
  let data: assistance[] = []
  let pageCount = 0

  if (prisma) {
    const prismaPromises: [PrismaPromise<number>, PrismaPromise<assistance[]>] =
      [
        prisma.assistance.count(
          containsQuery
            ? {
                where: {
                  assist: {
                    contains: containsQuery,
                    mode: 'insensitive',
                  },
                },
              }
            : undefined
        ),
        prisma.assistance.findMany({
          take: pageSize,
          skip: pageSize * (page - 1),
          orderBy: {
            created_at: 'desc',
          },
          ...(containsQuery && {
            where: {
              assist: {
                contains: containsQuery,
                mode: 'insensitive',
              },
            },
          }),
        }),
      ]

    const [helpCount, helpData] = await Promise.all(prismaPromises)
    pageCount = Math.ceil(helpCount / pageSize)

    data = helpData.map((re) => {
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

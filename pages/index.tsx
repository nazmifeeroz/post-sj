import prisma from 'lib/prisma'
import { shares } from '@prisma/client'
import type { NextPage } from 'next'

const Home: NextPage = (props) => {
  return <div>Hello</div>
}

export async function getStaticProps() {
  let data = null

  if (prisma) {
    const response = (await prisma.shares.findFirst({
      where: { id: 228 },
    })) as shares

    const { created_at, updated_at, ...rest } = response
    data = {
      ...rest,
      created_at: created_at && new Date(created_at).toString(),
      updated_at: updated_at && new Date(updated_at).toString(),
    }
  }

  return {
    props: {
      some: 'stuff',
      shares: data,
    },
  }
}

export default Home

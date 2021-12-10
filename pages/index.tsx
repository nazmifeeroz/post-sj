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
    data = rest
  }

  return {
    props: {
      some: 'stuff',
      shares: data,
    },
  }
}

export default Home

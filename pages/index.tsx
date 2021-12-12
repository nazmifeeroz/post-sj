import prisma from 'lib/prisma'
import { shares } from '@prisma/client'
import type { NextPage } from 'next'

const Home: NextPage = (props) => {
  return <div>Hello</div>
}

export async function getStaticProps() {
  let data = null

  if (prisma) {
    const response = (await prisma.shares.findMany()) as shares[]

    data = response.map((re) => ({
      ...re,
      created_at: re.created_at && new Date(re.created_at).toString(),
      updated_at: re.updated_at && new Date(re.updated_at).toString(),
      created_at_day:
        re.created_at_day && new Date(re.created_at_day).toString(),
    }))
  }

  return {
    props: {
      some: 'stuff',
      shares: data,
    },
  }
}

export default Home

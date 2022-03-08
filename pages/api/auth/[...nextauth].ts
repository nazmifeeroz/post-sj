import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { redirect } from 'next/dist/server/api-utils'

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: {
          label: 'Username',
          type: 'text',
          placeholder: 'username',
          disabled: true,
          value: 'developer@sj.io',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (credentials!.password === process.env.NEXTAUTH_SJ_PASSWORD)
          return {}

        return null
      },
    }),
  ],
  callbacks: {
    async redirect({ baseUrl }) {
      return baseUrl
    },
  },
})

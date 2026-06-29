import bcrypt from "bcryptjs"

import type { NextAuthOptions } from "next-auth"

import { db } from "@/lib/prisma"

import CredentialsProvider from "next-auth/providers/credentials"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string | null
      name: string
      role: "consultant"
    }
  }
  interface User {
    id: string
    email: string | null
    name: string
    role: "consultant"
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string | null
    name: string
    role: "consultant"
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const consultant = await db.consultant.findUnique({
          where: { email: credentials.email },
        })

        if (!consultant) return null

        const valid = await bcrypt.compare(
          credentials.password,
          consultant.passwordHash
        )
        if (!valid) return null

        return {
          id: consultant.id,
          email: consultant.email,
          name: consultant.name,
          role: "consultant" as const,
        }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.role = token.role
      }
      return session
    },
  },
}

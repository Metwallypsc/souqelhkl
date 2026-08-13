import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Phone or Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const identifier = (credentials.identifier || "").toString().trim();
        const password = (credentials.password || "").toString();

        // find by phone or email
        const user = await prisma.user.findFirst({
          where: {
            OR: [{ phone: identifier }, { email: identifier }]
          }
        });

        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email ?? undefined,
          role: user.role
        } as any;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as any).user = user;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).user = (token as any).user;
      return session;
    }
  },
  pages: {
    signIn: "/register"
  },
  secret: process.env.NEXTAUTH_SECRET
};

export default authOptions;

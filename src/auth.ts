import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (rawCredentials) => {
        const parsed = credentialsSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;

        const staffUser = await prisma.staffUser.findUnique({
          where: { email: parsed.data.email },
        });
        if (!staffUser) return null;

        const isValidPassword = await bcrypt.compare(parsed.data.password, staffUser.passwordHash);
        if (!isValidPassword) return null;

        return { id: staffUser.id, email: staffUser.email, name: staffUser.name };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.staffId = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && typeof token.staffId === "string") {
        session.user.id = token.staffId;
      }
      return session;
    },
  },
});

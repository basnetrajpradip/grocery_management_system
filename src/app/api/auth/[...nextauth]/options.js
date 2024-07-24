import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import db from "@/db/db";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        storeId: { label: "Store", type: "text" },
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        try {
          const user = await db.user.findUnique({ where: { email: credentials.email } });

          if (!user) {
            return null;
          }

          if (user.storeId !== credentials.storeId) {
            return null;
          }

          let passwordsMatch;

          if (user.role === "ADMIN") {
            passwordsMatch = await bcrypt.compare(credentials.password, user.password);
          } else {
            passwordsMatch = credentials.password === user.password;
          }

          if (!passwordsMatch || !user.accessGrant) {
            return null;
          }

          const store = await db.store.findUnique({ where: { id: user.storeId }, select: { name: true } });
          const storeName = store?.name;

          const { id, email, role, username, storeId, imagePath } = user;
          return { id, email, role, username, storeId, imagePath, storeName };
        } catch (error) {
          console.log("Error: ", error);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username;
        token.email = user.email;
        token.id = user.id;
        token.role = user.role;
        token.storeId = user.storeId;
        token.imagePath = user.imagePath;
        token.storeName = user.storeName;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.username = token.username;
        session.user.email = token.email;
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.storeId = token.storeId;
        session.user.imagePath = token.imagePath;
        session.user.storeName = token.storeName;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

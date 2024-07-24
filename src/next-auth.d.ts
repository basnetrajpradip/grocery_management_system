import NextAuth from "next-auth/next";

declare module "next-auth" {
  interface Session {
    user: {
      id: string | undefined;
      storeId: string | undefined;
      username: string | undefined;
      email: string | undefined;
      role: string | undefined;
      imagePath: string | undefined;
      storeName: string | undefined;
    };
  }
}

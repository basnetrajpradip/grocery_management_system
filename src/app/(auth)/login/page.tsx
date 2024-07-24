import db from "@/db/db";
import { LoginForm } from "../_components/LoginForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export interface Store {
  id: string;
  name: string;
}

export default async function LoginPage() {
  const stores = await db.store.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const session = await getServerSession(authOptions);

  if (session && session.user.role === "ADMIN") redirect("/admin");

  if (session && session.user.role === "USER") redirect("/user");

  return <LoginForm stores={stores} />;
}

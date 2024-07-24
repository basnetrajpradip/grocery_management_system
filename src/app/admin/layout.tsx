import { AdminNavBar } from "@/components/Nav";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <>
      <AdminNavBar session={session} />
      <div className=" container my-6">{children}</div>
    </>
  );
}

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { UserNavBar } from "@/components/Nav";
import { getServerSession } from "next-auth";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <>
      <UserNavBar session={session} />
      <div className=" container my-6">{children}</div>
    </>
  );
}

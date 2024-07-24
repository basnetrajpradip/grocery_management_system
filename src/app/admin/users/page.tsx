import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react";
import Link from "next/link";
import db from "@/db/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { AcessGrantDropdownItem, DeleteUserDropdownItem } from "./_components/UserActions";
import { PageHeader } from "@/components/HeroTitle";
import { NavButton } from "@/components/Nav";

export default function AdminUsersPage() {
  return (
    <div className="flex flex-col gap-5">
      <PageHeader>
        <div className="flex md:justify-between md:items-center md:flex-row flex-col items-start gap-3">
          <div>Users</div>
          <div className="flex justify-end">
            <NavButton href="/admin/users/new">Add User</NavButton>
          </div>
        </div>
      </PageHeader>
      <div className="flex flex-col">
        <UsersTable />
      </div>
    </div>
  );
}

async function UsersTable() {
  const session = await getServerSession(authOptions);

  const users = await db.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      accessGrant: true,
      _count: { select: { sales: true } },
    },
    where: {
      role: "USER",
      storeId: session?.user.storeId,
    },
    orderBy: { username: "asc" },
  });

  if (users.length === 0) return <p className="text-center mt-10">No Users found !</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Access Grant</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Sales Count</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              {user.accessGrant ? (
                <>
                  <span className="sr-only">Access Permitted</span>
                  <CheckCircle2 className="stroke-primary" />
                </>
              ) : (
                <>
                  <span className="sr-only">Access Denied</span>
                  <XCircle className="stroke-destructive" />
                </>
              )}
            </TableCell>
            <TableCell>{user.username}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{formatNumber(user._count.sales)}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                  <span className="sr-only">Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/users/${user.id}/edit`}>Edit</Link>
                  </DropdownMenuItem>
                  <AcessGrantDropdownItem id={user.id} isAccessGranted={user.accessGrant} />
                  <DropdownMenuSeparator />
                  <DeleteUserDropdownItem id={user.id} disabled={user._count.sales > 0} />
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

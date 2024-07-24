import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import db from "@/db/db";
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ActiveToggleDropdownItem, DeleteDropdownItem } from "./_components/ProductActions";
import { PageHeader } from "@/components/HeroTitle";
import { NavButton } from "@/components/Nav";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export default async function AdminProductsPage() {
  return (
    <div className="flex flex-col gap-5">
      <PageHeader>
        <div className="flex md:justify-between md:items-center md:flex-row flex-col items-start gap-3">
          <div>Products</div>
          <div className="flex justify-end">
            <NavButton href="/admin/products/add-category">Add Category</NavButton>
          </div>
        </div>
      </PageHeader>
      <div className="flex flex-col">
        <ProductsTable />
      </div>
    </div>
  );
}

async function ProductsTable() {
  const session = await getServerSession(authOptions);
  const products = await db.product.findMany({
    select: {
      id: true,
      name: true,
      priceInRs: true,
      isAvailableForPurchase: true,
      _count: { select: { sales: true } },
    },
    where: {
      storeId: session?.user.storeId,
    },
    orderBy: { name: "asc" },
  });

  if (products.length === 0) return <p className="text-center mt-10">No products found !</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Availability</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Sales</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              {product.isAvailableForPurchase ? (
                <>
                  <span className="sr-only">Available</span>
                  <CheckCircle2 className="stroke-primary" />
                </>
              ) : (
                <>
                  <span className="sr-only">Unavailable</span>
                  <XCircle className="stroke-destructive" />
                </>
              )}
            </TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>{formatCurrency(product.priceInRs)}</TableCell>
            <TableCell>{formatNumber(product._count.sales)}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                  <span className="sr-only">Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <a download href={`/admin/products/${product.id}/download`}>
                      Download
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                  </DropdownMenuItem>
                  <ActiveToggleDropdownItem id={product.id} isAvailableForPurchase={product.isAvailableForPurchase} />
                  <DropdownMenuSeparator />
                  <DeleteDropdownItem id={product.id} disabled={product._count.sales > 0} />
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

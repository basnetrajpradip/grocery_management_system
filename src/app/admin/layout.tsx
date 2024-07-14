import { Nav, NavButton, NavLink } from "@/components/Nav";

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Nav>
        <NavLink href={"/admin"}>Dashboard</NavLink>
        <NavLink href={"/admin/products"}>Products</NavLink>
        <NavLink href={"/admin/users"}>Users</NavLink>
        <NavLink href={"/admin/sales"}>Sales</NavLink>
        <NavButton href={"/admin/products/new"}>Add Product</NavButton>
      </Nav>
      <div className=" container my-6">{children}</div>
    </>
  );
}

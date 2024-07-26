import { PageHeader } from "@/components/HeroTitle";
import { UserProducts } from "../_components/UserProducts";
import db from "@/db/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export interface Category {
  name: string;
  id: string;
}

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);
  const categories = await db.category.findMany({
    select: {
      id: true,
      name: true,
    },
    where: {
      storeId: session?.user.storeId,
    },
    orderBy: {
      name: "asc",
    },
  });

  categories.unshift({ name: "All categories", id: "all" });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader>Products</PageHeader>
      <div>
        <UserProducts categories={categories} storeId={session?.user.storeId} />
      </div>
    </div>
  );
}

import { PageHeader } from "@/components/HeroTitle";
import { UserProducts } from "../_components/UserProducts";
import db from "@/db/db";

export interface Category {
  name: string;
  id: string;
}

export default async function ProductsPage() {
  const categories = await db.category.findMany({
    select: {
      id: true,
      name: true,
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
        <UserProducts categories={categories} />
      </div>
    </div>
  );
}

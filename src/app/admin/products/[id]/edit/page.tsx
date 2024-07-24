import db from "@/db/db";
import { ProductForm } from "../../_components/ProductForm";
import { PageHeader } from "@/components/HeroTitle";

export default async function EditProductPage({ params: { id } }: { params: { id: string } }) {
  const categories = await db.category.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const product = await db.product.findUnique({ where: { id } });
  return (
    <div className="flex flex-col gap-6">
      <PageHeader>Edit Product</PageHeader>
      <ProductForm product={product} categories={categories} />
    </div>
  );
}

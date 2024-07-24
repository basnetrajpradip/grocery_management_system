import db from "@/db/db";
import { ProductForm } from "../_components/ProductForm";
import { PageHeader } from "@/components/HeroTitle";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export interface Category {
  name: string;
  id: string;
}

export default async function AddNewProductPage() {
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
  return (
    <div className="flex flex-col gap-6">
      <PageHeader>Add Product</PageHeader>
      <ProductForm categories={categories} />
    </div>
  );
}

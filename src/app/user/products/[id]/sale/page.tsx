import db from "@/db/db";
import { notFound } from "next/navigation";
import { SaleForm } from "../../../_components/SaleForm";

export default async function ProductSalePage({ params: { id } }: { params: { id: string } }) {
  const product = await db.product.findUnique({ where: { id } });
  if (product == null) return notFound();

  return <SaleForm product={product} />;
}

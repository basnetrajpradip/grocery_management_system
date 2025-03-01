import db from "@/db/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { categoryId, storeId } = await req.json();
    let products;
    if (categoryId === "all") {
      products = await db.product.findMany({ where: { isAvailableForPurchase: true, storeId: storeId }, orderBy: { name: "asc" } });
    } else {
      products = await db.product.findMany({
        where: { categoryId: categoryId, isAvailableForPurchase: true, storeId: storeId },
        orderBy: { name: "asc" },
      });
    }
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ message: "An error occured." }, { status: 500 });
  }
}

"use server";

import db from "@/db/db";
import { z } from "zod";
import fs from "fs/promises";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

const fileSchema = z.instanceof(File, { message: "Required" });
const imageSchema = fileSchema.refine((file) => file.size === 0 || file.type.startsWith("image/"));

const addSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceInRs: z.coerce.number().int().min(1),
  file: fileSchema.refine((file) => file.size > 0, "Required"),
  image: imageSchema.refine((file) => file.size > 0, "Required"),
  categoryId: z.string().min(1, { message: "Category must be selected." }),
});

const editSchema = addSchema.extend({
  file: fileSchema.optional(),
  image: imageSchema.optional(),
});

const categorySchema = z.object({
  name: z.string().min(1),
});

export async function addProduct(prevState: unknown, formData: FormData) {
  const session = await getServerSession(authOptions);

  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  await fs.mkdir("products", { recursive: true });
  const filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
  await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));

  await fs.mkdir("public/products", { recursive: true });
  const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;
  await fs.writeFile(`public${imagePath}`, Buffer.from(await data.image.arrayBuffer()));

  const storeId = session?.user.storeId || "";

  await db.product.create({
    data: {
      isAvailableForPurchase: true,
      name: data.name,
      description: data.description,
      priceInRs: data.priceInRs,
      filePath,
      imagePath,
      storeId: storeId,
      categoryId: data.categoryId,
    },
  });

  redirect("/admin/products");
}

export async function updateProduct(id: string, prevState: unknown, formData: FormData) {
  const result = editSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;
  const product = await db.product.findUnique({ where: { id } });

  if (product == null) return notFound();

  let filePath = product.filePath;
  if (data.file != null && data.file.size > 0) {
    await fs.unlink(product.filePath);
    filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
    await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));
  }

  let imagePath = product.imagePath;
  if (data.image != null && data.image.size > 0) {
    await fs.unlink(`public${product.imagePath}`);
    imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;
    await fs.writeFile(`public${imagePath}`, Buffer.from(await data.image.arrayBuffer()));
  }

  await db.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      priceInRs: data.priceInRs,
      filePath,
      imagePath,
    },
  });
  redirect("/admin/products");
}

export async function toggleProductAvailability(id: string, isAvailableForPurchase: boolean) {
  await db.product.update({ where: { id }, data: { isAvailableForPurchase } });
}

export async function deleteProduct(id: string) {
  const product = await db.product.delete({ where: { id } });
  if (product == null) return notFound();

  await fs.unlink(product.filePath);
  await fs.unlink(`public${product.imagePath}`);
}

export async function addCategory(prevState: unknown, formData: FormData) {
  const session = await getServerSession(authOptions);

  const result = categorySchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;
  const categoryName = data.name.charAt(0).toUpperCase() + data.name.slice(1).toLowerCase();

  const storeId = session?.user.storeId || "";
  const category = await db.category.findFirst({ where: { name: categoryName, storeId: storeId } });

  if (!category) {
    await db.category.create({
      data: {
        name: categoryName,
        storeId: storeId,
      },
    });
  } else {
    return { name: "This category already exists." };
  }

  redirect("/admin/products");
}

const sellSchema = z.object({
  productId: z.string().min(1),
  priceSoldInRs: z.coerce.number().int().min(1),
});

export async function saleProduct(prevState: unknown, formData: FormData) {
  const session = await getServerSession(authOptions);

  const result = sellSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;
  const userId = session?.user.id || "";
  const storeId = session?.user.storeId || "";

  await db.sale.create({
    data: {
      priceSoldInRs: data.priceSoldInRs,
      productId: data.productId,
      userId: userId,
      storeId: storeId,
    },
  });
  redirect("/user/products");
}

"use server";

import db from "@/db/db";
import { z } from "zod";
import fs from "fs/promises";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { Prisma } from "@prisma/client";

const fileSchema = z.instanceof(File, { message: "Required" });
const imageSchema = fileSchema.refine((file) => file.size === 0 || file.type.startsWith("image/"));

const userSchema = z.object({
  username: z.string().min(1),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6),
  image: imageSchema.refine((file) => file.size > 0, "Required"),
});

const editSchema = userSchema.extend({
  file: fileSchema.optional(),
  image: imageSchema.optional(),
});

export async function addUser(prevState: unknown, formData: FormData) {
  const session = await getServerSession(authOptions);

  const result = userSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  const storeId = session?.user.storeId || "";
  const imagePath = `/users/${crypto.randomUUID()}-${data.image.name}`;

  try {
    await db.user.create({
      data: {
        username: data.username,
        password: data.password,
        imagePath,
        email: data.email,
        storeId: storeId,
      },
    });
    await fs.writeFile(`public${imagePath}`, Buffer.from(await data.image.arrayBuffer()));
    redirect("/admin/users");
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return { email: "A user with this email already exists.", username: "", password: "", image: "" };
      }
    } else {
      console.error("Error during signup:", err);
    }
  }
}

export async function updateUser(id: string, prevState: unknown, formData: FormData) {
  const result = editSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;
  const user = await db.user.findUnique({ where: { id } });

  if (user == null) return notFound();

  let imagePath = user.imagePath;
  if (data.image != null && data.image.size > 0) {
    await fs.unlink(`public${user.imagePath}`);
    imagePath = `/users/${crypto.randomUUID()}-${data.image.name}`;
    await fs.writeFile(`public${imagePath}`, Buffer.from(await data.image.arrayBuffer()));
  }

  await db.user.update({
    where: { id },
    data: {
      username: data.username,
      email: data.email,
      password: data.password,
      imagePath,
    },
  });
  redirect("/admin/users");
}

export async function toggleUserAccessGrant(id: string, accessGrant: boolean) {
  await db.user.update({ where: { id }, data: { accessGrant: accessGrant } });
}

export async function deleteUser(id: string) {
  const user = await db.user.delete({ where: { id } });
  if (user == null) return notFound();

  await fs.unlink(`public${user.imagePath}`);
}

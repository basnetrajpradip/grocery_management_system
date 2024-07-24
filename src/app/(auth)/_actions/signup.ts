"use server";
import bcrypt from "bcryptjs";

import db from "@/db/db";
import { z } from "zod";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";

const signupSchema = z
  .object({
    name: z.string().min(1),
    address: z.string().min(1),
    username: z.string().min(1),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6),
    confirmpassword: z.string().min(6),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmpassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmpassword"],
      });
    }
  });

export async function signup(prevState: unknown, formData: FormData) {
  const result = signupSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  try {
    await db.$transaction(async (prisma) => {
      const createdStore = await prisma.store.create({
        data: {
          name: data.name,
          address: data.address,
        },
      });

      const hashedPassword = await bcrypt.hash(data.password, 10);

      await prisma.user.create({
        data: {
          username: data.username,
          email: data.email,
          password: hashedPassword,
          storeId: createdStore.id,
          role: "ADMIN",
          imagePath: "/users/admin.png",
        },
      });
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return { email: "A user with this email already exists.", confirmpassword: "" };
      }
    } else {
      console.error("Error during signup:", err);
    }
  }
  redirect("/login");
}

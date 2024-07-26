"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/formatters";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { useFormState, useFormStatus } from "react-dom";
import { Input } from "@/components/ui/input";
import { saleProduct } from "@/app/admin/_actions/products";

export function SaleForm({ product }: { product: Product }) {
  const [error, action] = useFormState(saleProduct, {});
  return (
    <>
      <form action={action} className="flex justify-center items-center mt-10">
        <Card className="flex overflow-hidden flex-col md:w-1/2 sm:3/4">
          <div className="relative w-full h-auto aspect-video">
            <Image src={product.imagePath} fill alt={product.name} />
          </div>
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle>{product.name}</CardTitle>
            </div>
            <CardDescription>{formatCurrency(product.priceInRs)}</CardDescription>
            <Input type="hidden" value={product.priceInRs} name="priceSoldInRs" />
            <Input type="hidden" value={product.id} name="productId" />
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="">{product.description}</p>
            <div>
              <Label htmlFor="quantity"></Label>
            </div>
          </CardContent>
          <CardFooter>
            {error && <div>{error.priceSoldInRs}</div>}
            {error && <div>{error.productId}</div>}
            <SubmitButton />
          </CardFooter>
        </Card>
      </form>
    </>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Selling Product..." : "Sale Product"}
    </Button>
  );
}

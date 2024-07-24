"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, formatFilename } from "@/lib/formatters";
import { useState } from "react";
import { addProduct, updateProduct } from "../../_actions/products";
import { useFormState, useFormStatus } from "react-dom";
import { Product } from "@prisma/client";
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category } from "../new/page";

interface ProductFormProps {
  categories?: Category[];
  product?: Product | null;
}

export const ProductForm: React.FC<ProductFormProps> = ({ categories, product }) => {
  const [error, action] = useFormState(product == null ? addProduct : updateProduct.bind(null, product.id), {});
  const [priceInRs, setPriceInRs] = useState<number | undefined>(product?.priceInRs);
  const [categoryId, setCategoryId] = useState(product?.categoryId || "");
  return (
    <form action={action} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name :</Label>
        <Input type="text" id="name" name="name" required defaultValue={product?.name || ""} />
        {error.name && <div className="text-destructive">{error.name}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={categoryId} onValueChange={(value) => setCategoryId(value)} required>
          <SelectTrigger id="category" name="category" className="w-full">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error.categoryId && <div className="text-destructive">{error.categoryId}</div>}
        <input type="hidden" name="categoryId" value={categoryId} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="priceInRs">Price in NPR :</Label>
        <Input
          type="number"
          id="priceInRs"
          name="priceInRs"
          required
          value={priceInRs}
          onChange={(e) => setPriceInRs(Number(e.target.value) || undefined)}
        />
        <div className="text-muted-foreground">{formatCurrency(priceInRs || 0)}</div>
        {error.priceInRs && <div className="text-destructive">{error.priceInRs}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description :</Label>
        <Textarea id="description" name="description" required defaultValue={product?.description || ""} />
        {error.description && <div className="text-destructive">{error.description}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="file">{product ? "Edit Current File :" : "File (Purchase Bill/ Product related file) :"}</Label>
        <Input type="file" id="file" name="file" required={product == null} />
        {product != null && <div className="text-muted-foreground">{`Current File : ${formatFilename(product.filePath)}`}</div>}
        {error.file && <div className="text-destructive">{error.file}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">{product ? "Edit Current Image :" : "Image :"}</Label>
        <Input type="file" id="image" name="image" required={product == null} />
        {product != null && (
          <>
            <div className="text-muted-foreground">Current Image Preview :</div>
            <Image src={product.imagePath} alt="Product Image" fetchPriority="high" width="200" height="200" decoding="async" loading="lazy" />
          </>
        )}
        {error.image && <div className="text-destructive">{error.image}</div>}
      </div>
      <SubmitButton />
    </form>
  );
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </Button>
  );
}

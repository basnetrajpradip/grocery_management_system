"use client";
import { PageHeader } from "@/components/HeroTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState, useFormStatus } from "react-dom";
import { addCategory } from "../../_actions/products";

export function AddCategoryForm() {
  const [error, action] = useFormState(addCategory, {});
  return (
    <div className="flex flex-col gap-8">
      <PageHeader>Add Category</PageHeader>
      <form action={action} className="space-y-8">
        <div className="space-y-2">
          <Label htmlFor="name">Category Name :</Label>
          <Input type="text" id="name" name="name" required />
          {error.name && <div className="text-destructive">{error.name}</div>}
        </div>
        <SubmitButton />
      </form>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Adding..." : "Add Category"}
    </Button>
  );
}

import db from "@/db/db";
import { UserForm } from "../../_components/UserForm";
import { PageHeader } from "@/components/HeroTitle";

export default async function EditProductPage({ params: { id } }: { params: { id: string } }) {
  const user = await db.user.findUnique({ where: { id } });
  return (
    <div className="flex flex-col gap-6">
      <PageHeader>Edit User</PageHeader>
      <UserForm user={user} />
    </div>
  );
}

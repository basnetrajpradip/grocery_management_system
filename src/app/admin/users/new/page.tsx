import { PageHeader } from "@/components/HeroTitle";
import { UserForm } from "../_components/UserForm";

export default function AddNewUser() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader>Add User</PageHeader>
      <UserForm />
    </div>
  );
}

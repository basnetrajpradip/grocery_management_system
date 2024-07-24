import { getServerSession } from "next-auth";
import { SignupForm } from "../_components/SignupForm";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export default async function SignupPage() {
  const session = await getServerSession(authOptions);

  if (session) redirect("/");
  return <SignupForm />;
}

"use client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormState, useFormStatus } from "react-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Store } from "../login/page";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface LoginFormProps {
  stores?: Store[];
}

export const LoginForm: React.FC<LoginFormProps> = ({ stores }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [storeId, setStoreId] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setPending(true);
      const res = await signIn("credentials", {
        storeId,
        email,
        password,
        redirect: false,
      });

      if (res && res.error) {
        setError("Invalid Credentials / Access Denied");
        setPending(false);
        return;
      }
      router.replace("/admin");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex flex-col h-screen w-full p-3 items-center justify-center bg-neutral_silver">
      <Card className="w-full max-w-lg shadow-card_shadow md:p-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">Log In to Grocery</CardTitle>
          <CardDescription>Login to manage your Grocery Store.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="email">
                Email<span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="eg@example.com"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">
                Password<span className="text-destructive">*</span>
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Type in your Password"
                minLength={6}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">
                Grocery <span className="text-destructive">*</span>
              </Label>
              <Select value={storeId} onValueChange={(value) => setStoreId(value)} required>
                <SelectTrigger id="role" className="w-full">
                  <SelectValue placeholder="Select your Grocery" />
                </SelectTrigger>
                <SelectContent>
                  {stores?.map((store) => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {error && <div className="text-destructive text-center">{error} </div>}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Logging In..." : "Log In"}
            </Button>
          </form>
          <div className="flex justify-center mt-4">
            <Link href={"/signup"} className="text-shade_3 hover:underline hover:text-primary">
              Haven&apos;t Registered into Grocery? Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

"use client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormState, useFormStatus } from "react-dom";
import { signup } from "../_actions/signup";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function SignupForm() {
  const [error, action] = useFormState(signup, {});

  return (
    <div className="flex flex-col h-screen w-full p-3 items-center justify-center bg-neutral_silver">
      <Card className="w-full max-w-lg shadow-card_shadow md:p-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">Sign up to Grocery</CardTitle>
          <CardDescription>Manage your Grocery store by signing up.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-8">
            <div className="grid gap-2">
              <Label htmlFor="name">
                Store Name<span className="text-destructive">*</span>
              </Label>
              <Input id="name" name="name" placeholder="Mero Grocery Store" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">
                Store Address<span className="text-destructive">*</span>
              </Label>
              <Input id="address" name="address" placeholder="Itahari, Nepal" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">
                Username<span className="text-destructive">*</span>
              </Label>
              <Input id="username" name="username" placeholder="John Doe" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">
                Email<span className="text-destructive">*</span>
              </Label>
              <Input id="email" name="email" type="email" placeholder="eg@example.com" required />
              {error?.email && <div className="text-destructive">{error.email} </div>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">
                Password<span className="text-destructive">*</span>
              </Label>
              <Input id="password" name="password" type="password" placeholder="Min 6 characters long" minLength={6} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmpassword">
                Confirm Password<span className="text-destructive">*</span>
              </Label>
              <Input id="confirmpassword" type="password" placeholder="Retype password" minLength={6} required name="confirmpassword" />
              {error?.confirmpassword && <div className="text-destructive">{error.confirmpassword}</div>}
            </div>
            <SubmitButton />
          </form>
          <div className="flex justify-center mt-4">
            <Link href={"/login"} className="text-shade_3 hover:underline hover:text-primary">
              Haven&apos;t Registered into Grocery? Log In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Signing Up..." : "Sign Up"}
    </Button>
  );
}

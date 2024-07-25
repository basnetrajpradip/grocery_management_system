"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addUser, updateUser } from "../../_actions/users";
import { useFormState, useFormStatus } from "react-dom";
import { User } from "@prisma/client";
import Image from "next/image";

export function UserForm({ user }: { user?: User | null }) {
  const [error, action] = useFormState(user == null ? addUser : updateUser.bind(null, user.id), {});

  return (
    <form action={action} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="username">User Name :</Label>
        <Input type="text" id="username" name="username" required defaultValue={user?.username || ""} />
        {error?.username && <div className="text-destructive">{error.username}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email :</Label>
        <Input type="email" id="email" name="email" required defaultValue={user?.email || ""} />
        {error?.email && <div className="text-destructive">{error.email}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Login Password :</Label>
        <Input
          type="text"
          id="password"
          name="password"
          required
          defaultValue={user ? user.password : ""}
          placeholder="Min 6 characters long"
          minLength={6}
        />
        {error?.password && <div className="text-destructive">{error.password}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">{user ? "Edit Current Image :" : "User Image :"}</Label>
        <Input type="file" id="image" name="image" required={user == null} />
        {user != null && (
          <>
            <div className="text-muted-foreground">Current User Image Preview :</div>
            <Image src={user.imagePath} alt="user Image" fetchPriority="high" width="200" height="200" decoding="async" loading="lazy" />
          </>
        )}
        {error?.image && <div className="text-destructive">{error.image}</div>}
      </div>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving User..." : "Save User"}
    </Button>
  );
}

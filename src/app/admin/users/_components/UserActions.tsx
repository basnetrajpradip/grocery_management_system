"use client";
import { useTransition } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { deleteUser, toggleUserAccessGrant } from "../../_actions/users";

export function AcessGrantDropdownItem({ id, isAccessGranted }: { id: string; isAccessGranted: boolean }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await toggleUserAccessGrant(id, !isAccessGranted);
          router.refresh();
        });
      }}
    >
      {isAccessGranted ? "Remove Access" : "Grant Access"}
    </DropdownMenuItem>
  );
}

export function DeleteUserDropdownItem({ id, disabled }: { id: string; disabled: boolean }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={disabled || isPending}
      onClick={() => {
        startTransition(async () => {
          await deleteUser(id);
          router.refresh();
        });
      }}
    >
      Delete
    </DropdownMenuItem>
  );
}

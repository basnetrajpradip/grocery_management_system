"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps, ReactNode } from "react";
import { Button } from "./ui/button";
import { LucidePlus } from "lucide-react";

export function Nav({ children }: { children: ReactNode }) {
  return (
    <header className="bg-neutral_white shadow-custom">
      <nav className="container py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1 font-bold cursor-pointer">
          <Image src={"/logo.png"} width={30} height={30} alt="logo" />
          <span className="text-2xl">Grocery</span>
        </Link>
        <div>
          <div className="flex items-center space-x-8">
            <ul className="flex items-center space-x-8 text-lg">{children}</ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">) {
  const pathname = usePathname();
  return (
    <li>
      <Link {...props} className={cn("hover:text-neutral_d_grey", pathname === props.href && "font-semibold text-primary hover:text-primary")} />
    </li>
  );
}

export function NavButton({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname();
  return (
    <li>
      <Link href={href} passHref>
        <Button className={cn("rounded py-6 px-6", pathname === href && "font-semibold bg-neutral_silver text-primary")}>
          <div className="flex items-center gap-1 text-base">
            {children}
            <LucidePlus />
          </div>
        </Button>
      </Link>
    </li>
  );
}

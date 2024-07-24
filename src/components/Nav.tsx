"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps, ReactNode, useState } from "react";
import { Button } from "./ui/button";
import { LogOut, LucidePlus, MenuIcon } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Separator } from "./ui/separator";
import { Session } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { signOut } from "next-auth/react";

export function Nav({ children }: { children: ReactNode }) {
  return (
    <header className="bg-neutral_white shadow-custom">
      <nav className="container py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1 font-bold cursor-pointer" prefetch={false}>
          <Image src={"/logo.png"} width={30} height={30} alt="logo" />
          <span className="text-2xl">Grocery</span>
        </Link>
        <div>
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-8 md:text-lg">{children}</div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">) {
  const pathname = usePathname();
  return (
    <Link
      {...props}
      className={cn("hover:text-neutral_d_grey", pathname === props.href && "font-semibold text-primary hover:text-primary")}
      prefetch={false}
    />
  );
}

export function NavButton({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname();
  return (
    <Link href={href} passHref prefetch={false}>
      <Button className={cn("rounded py-6 px-6 w-40", pathname === href && "font-semibold bg-neutral_silver text-primary")}>
        <div className="flex items-center gap-1 text-base">
          {children}
          <LucidePlus />
        </div>
      </Button>
    </Link>
  );
}

export function AdminNavBar({ session }: { session: Session | null }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [openSheet, setOpenSheet] = useState(false);

  return isDesktop ? (
    <Nav>
      <NavLink href={"/admin"}>Dashboard</NavLink>
      <NavLink href={"/admin/products"}>Products</NavLink>
      <NavLink href={"/admin/users"}>Users</NavLink>
      <Sheet>
        <SheetTrigger asChild>
          <Avatar className="w-12 h-12 flex cursor-pointer">
            <AvatarImage src={session?.user.imagePath} alt="user-image"></AvatarImage>
            <AvatarFallback>{session?.user.username?.substring(0, 3).toLocaleUpperCase()}</AvatarFallback>
          </Avatar>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="text-left">
              <div className="text-center text-xl text-primary">Profile Information</div>
              <Separator className="my-1" />
              <div className="flex gap-5 items-center">
                <Avatar className="w-16 h-16 flex">
                  <AvatarImage src={session?.user.imagePath} alt="user-image"></AvatarImage>
                  <AvatarFallback>{session?.user.username?.substring(0, 3).toLocaleUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div className="text-md">
                    <span className="font-semibold text-md text-muted-foreground">Name : </span>
                    {`${session?.user.username}`}
                  </div>
                  <div className="text-md">
                    <span className="font-semibold text-md text-muted-foreground">Store : </span>
                    {session?.user.storeName}
                  </div>
                  <div className="text-md">
                    <span className="font-semibold text-md text-muted-foreground">Email : </span>
                    {session?.user.email}
                  </div>
                </div>
              </div>
              <Separator className="my-2" />
              <div className="flex flex-1 justify-center">
                <Button variant={"destructive"} onClick={() => signOut()}>
                  Log Out
                  <LogOut className="pl-2" />
                </Button>
              </div>
            </SheetTitle>
            <SheetDescription className="sr-only">User Information with log out button</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <NavButton href={"/admin/products/new"}>Add Product</NavButton>
    </Nav>
  ) : (
    <Nav>
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetTrigger asChild>
          <MenuIcon />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="text-left">
              <div className="flex gap-5 items-center">
                <Avatar className="w-12 h-12 flex">
                  <AvatarImage src={session?.user.imagePath} alt="user-image"></AvatarImage>
                  <AvatarFallback>{session?.user.username?.substring(0, 3).toLocaleUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div className="text-xl font-bold">{`${session?.user.username}`}</div>
                  <div className="text-muted-foreground text-sm">{session?.user.storeName}</div>
                </div>
                <div className="flex flex-1 justify-center">
                  <Button variant={"destructive"} onClick={() => signOut()}>
                    <LogOut className="w-5" />
                  </Button>
                </div>
              </div>
            </SheetTitle>
            <SheetDescription className="sr-only">User Information with log out button</SheetDescription>
          </SheetHeader>
          <Separator className="my-3" />
          <div className="text-xl p-3 bg-neutral_silver rounded-md">
            <NavLink
              href={"/admin"}
              onClick={() => {
                setOpenSheet(false);
              }}
            >
              Dashboard
            </NavLink>
          </div>
          <Separator className="my-1" />
          <div className="text-xl p-2 bg-neutral_silver">
            <NavLink
              href={"/admin/products"}
              onClick={() => {
                setOpenSheet(false);
              }}
            >
              Products
            </NavLink>
          </div>
          <Separator className="my-1" />
          <div className="text-xl p-2 bg-neutral_silver">
            <NavLink
              href={"/admin/users"}
              onClick={() => {
                setOpenSheet(false);
              }}
            >
              Users
            </NavLink>
          </div>
          <Separator className="my-1" />
          <div className="text-xl p-2 bg-neutral_silver">
            <NavLink
              href={"/admin/products/new"}
              onClick={() => {
                setOpenSheet(false);
              }}
            >
              Add Products
            </NavLink>
          </div>
          <Separator className="my-1" />
        </SheetContent>
      </Sheet>
    </Nav>
  );
}

export function UserNavBar({ session }: { session: Session | null }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [openSheet, setOpenSheet] = useState(false);

  return isDesktop ? (
    <Nav>
      <NavLink href={"/user"}>Dashboard</NavLink>
      <NavLink href={"/user/products"}>Products</NavLink>
      <Sheet>
        <SheetTrigger asChild>
          <Avatar className="w-12 h-12 flex cursor-pointer">
            <AvatarImage src={session?.user.imagePath} alt="user-image"></AvatarImage>
            <AvatarFallback>{session?.user.username?.substring(0, 3).toLocaleUpperCase()}</AvatarFallback>
          </Avatar>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="text-left">
              <div className="text-center text-xl text-primary">Profile Information</div>
              <Separator className="my-1" />
              <div className="flex gap-5 items-center">
                <Avatar className="w-16 h-16 flex">
                  <AvatarImage src={session?.user.imagePath} alt="user-image"></AvatarImage>
                  <AvatarFallback>{session?.user.username?.substring(0, 3).toLocaleUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div className="text-md">
                    <span className="font-semibold text-md text-muted-foreground">Name : </span>
                    {`${session?.user.username}`}
                  </div>
                  <div className="text-md">
                    <span className="font-semibold text-md text-muted-foreground">Store : </span>
                    {session?.user.storeName}
                  </div>
                  <div className="text-md">
                    <span className="font-semibold text-md text-muted-foreground">Email : </span>
                    {session?.user.email}
                  </div>
                </div>
              </div>
              <Separator className="my-2" />
              <div className="flex flex-1 justify-center">
                <Button variant={"destructive"} onClick={() => signOut()}>
                  Log Out
                  <LogOut className="pl-2" />
                </Button>
              </div>
            </SheetTitle>
            <SheetDescription className="sr-only">User Information with log out button</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </Nav>
  ) : (
    <Nav>
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetTrigger asChild>
          <MenuIcon />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="text-left">
              <div className="flex gap-5 items-center">
                <Avatar className="w-12 h-12 flex">
                  <AvatarImage src={session?.user.imagePath} alt="user-image"></AvatarImage>
                  <AvatarFallback>{session?.user.username?.substring(0, 3).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div className="text-xl font-bold">{`${session?.user.username}`}</div>
                  <div className="text-muted-foreground text-sm">{session?.user.storeName}</div>
                </div>
                <div className="flex flex-1 justify-center">
                  <Button variant={"destructive"} onClick={() => signOut()}>
                    <LogOut className="w-5" />
                  </Button>
                </div>
              </div>
            </SheetTitle>
            <SheetDescription className="sr-only">User Information with log out button</SheetDescription>
          </SheetHeader>
          <Separator className="my-3" />
          <div className="text-xl p-3 bg-neutral_silver rounded-md">
            <NavLink
              href={"/user"}
              onClick={() => {
                setOpenSheet(false);
              }}
            >
              Dashboard
            </NavLink>
          </div>
          <Separator className="my-1" />
          <div className="text-xl p-2 bg-neutral_silver">
            <NavLink
              href={"/user/products"}
              onClick={() => {
                setOpenSheet(false);
              }}
            >
              Products
            </NavLink>
          </div>
          <Separator className="my-1" />
        </SheetContent>
      </Sheet>
    </Nav>
  );
}

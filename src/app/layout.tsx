import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import AuthProvider from "./Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Grocery Management System",
  description: "Created by Pradip Raj Basnet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("bg-background min-h-screen font-sans antialiased", inter.variable)}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

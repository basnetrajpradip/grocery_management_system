import { ReactNode } from "react";

export function PageHeader({ children }: { children: ReactNode }) {
  return <h1 className="text-4xl mt-2 font-semibold">{children}</h1>;
}

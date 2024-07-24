import { formatCurrency } from "@/lib/formatters";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

type ProductCardProps = {
  id: string;
  name: string;
  priceInRs: number;
  description: string;
  imagePath: string;
};

export function ProductCard({ id, name, priceInRs, description, imagePath }: ProductCardProps) {
  return (
    <Card className="flex overflow-hidden flex-col shadow-card_shadow">
      <div className="relative w-full h-auto aspect-video">
        <Image src={imagePath} fill alt={name} />
      </div>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>{name}</CardTitle>
        </div>
        <CardDescription>{formatCurrency(priceInRs)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="line-clamp-2">{description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild size="lg" className="w-full">
          <Link href={`/user/products/${id}/sale`}>Add to Sale</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden flex flex-col animate-pulse">
      <div className="w-full aspect-video bg-gray-300" />
      <CardHeader>
        <CardTitle>
          <div className="w-3/4 h-6 rounded-full bg-gray-300" />
        </CardTitle>
        <CardDescription>
          <div className="w-1/2 h-4 rounded-full bg-gray-300" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="w-full h-4 rounded-full bg-gray-300" />
        <div className="w-full h-4 rounded-full bg-gray-300" />
        <div className="w-3/4 h-4 rounded-full bg-gray-300" />
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled size="lg"></Button>
      </CardFooter>
    </Card>
  );
}

export function SelectSkeleton() {
  return (
    <div>
      <Select disabled>
        <SelectTrigger className="w-full  rounded-full bg-gray-300">
          <SelectValue placeholder="Select Category" className=" rounded-full bg-gray-300" />
        </SelectTrigger>
        <SelectContent></SelectContent>
      </Select>
    </div>
  );
}

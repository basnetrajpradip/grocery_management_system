import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import db from "@/db/db";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product } from "@prisma/client";
import { Suspense } from "react";
import { PageHeader } from "@/components/HeroTitle";

async function getUserTotalSales(id: string | undefined) {
  const data = await db.sale.aggregate({
    _sum: { priceSoldInRs: true },
    _count: true,
    where: { userId: id },
  });

  return {
    amount: data._sum.priceSoldInRs || 0,
    numberOfSales: data._count,
  };
}

async function getUserTodaySales(id: string | undefined) {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const data = await db.sale.aggregate({
    _sum: {
      priceSoldInRs: true,
    },
    _count: true,
    where: {
      userId: id,
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  return {
    amount: data._sum.priceSoldInRs || 0,
    numberOfSales: data._count,
  };
}

async function getProductData(storeId: string | undefined) {
  const [activeCount, inactiveCount] = await Promise.all([
    db.product.count({ where: { isAvailableForPurchase: true, storeId: storeId } }),
    db.product.count({ where: { isAvailableForPurchase: false, storeId: storeId } }),
  ]);

  return { activeCount, inactiveCount };
}

function getMostPopularProducts() {
  return db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { sales: { _count: "desc" } },
    take: 6,
    include: { category: true },
  });
}

function getNewestProducts() {
  return db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { createdAt: "desc" },
    take: 6,
    include: { category: true },
  });
}

export default async function UserDashboard() {
  const session = await getServerSession(authOptions);
  const [totalsalesData, todaySalesData, productData] = await Promise.all([
    getUserTotalSales(session?.user.id),
    getUserTodaySales(session?.user.id),
    getProductData(session?.user.storeId),
  ]);

  return (
    <div className="flex flex-col gap-10">
      <PageHeader>My Dashboard</PageHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard
          title="My Total Sales"
          subtitle={`${formatNumber(totalsalesData.numberOfSales)} Sales`}
          body={formatCurrency(totalsalesData.amount)}
        />
        <DashboardCard
          title="My Today's Sales"
          subtitle={`${formatNumber(todaySalesData.numberOfSales)} Sales`}
          body={formatCurrency(todaySalesData.amount)}
        />
        <DashboardCard
          title="Active Products"
          subtitle={`${formatNumber(productData.inactiveCount)} Inactive`}
          body={formatNumber(productData.activeCount)}
        />
      </div>
      <main className="space-y-12">
        <ProductGridSection title="Most Popular" productsFetcher={getMostPopularProducts} />
        <ProductGridSection title="Newest" productsFetcher={getNewestProducts} />
      </main>
    </div>
  );
}

type DashboardCardProps = {
  title: string;
  subtitle: string;
  body: string;
};

function DashboardCard({ title, subtitle, body }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{body}</p>
      </CardContent>
    </Card>
  );
}

type ProductGridSectionProps = {
  title: string;
  productsFetcher: () => Promise<Product[]>;
};

function ProductGridSection({ productsFetcher, title }: ProductGridSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <h2 className="text-3xl font-semibold">{title}</h2>
        <Button variant="outline" asChild>
          <Link href="/user/products" className="space-x-2">
            <span>View All</span>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Suspense
          fallback={
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          }
        >
          <ProductSuspense productsFetcher={productsFetcher} />
        </Suspense>
      </div>
    </div>
  );
}

async function ProductSuspense({ productsFetcher }: { productsFetcher: () => Promise<Product[]> }) {
  return (await productsFetcher()).map((product) => <ProductCard key={product.id} {...product} />);
}

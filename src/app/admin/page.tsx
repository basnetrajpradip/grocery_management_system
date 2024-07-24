import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import db from "@/db/db";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { PageHeader } from "@/components/HeroTitle";

async function getSalesData(storeId: string | undefined) {
  const data = await db.sale.aggregate({
    _sum: { priceSoldInRs: true },
    _count: true,
    where: { storeId: storeId },
  });

  return {
    amount: data._sum.priceSoldInRs || 0,
    numberOfSales: data._count,
  };
}

async function getUserData(storeId: string | undefined) {
  const [userCount, saleData] = await Promise.all([
    db.user.count({ where: { storeId: storeId, role: "USER" } }),
    db.sale.aggregate({
      _sum: { priceSoldInRs: true },
      where: { storeId: storeId },
    }),
  ]);

  return {
    userCount,
    averageSalePerUser: userCount === 0 ? 0 : (saleData._sum.priceSoldInRs || 0) / userCount,
  };
}

async function getProductData(storeId: string | undefined) {
  const [activeCount, inactiveCount] = await Promise.all([
    db.product.count({ where: { isAvailableForPurchase: true, storeId: storeId } }),
    db.product.count({ where: { isAvailableForPurchase: false, storeId: storeId } }),
  ]);

  return { activeCount, inactiveCount };
}

async function getTodaySales(storeId: string | undefined) {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const data = await db.sale.aggregate({
    _sum: {
      priceSoldInRs: true,
    },
    _count: true,
    where: {
      storeId: storeId,
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

async function getCategoryData(storeId: string | undefined) {
  const CategoryData = await db.category.aggregate({
    _count: true,
    where: {
      storeId: storeId,
    },
  });

  const Productdata = await db.product.groupBy({
    by: ["categoryId"],
    _count: {
      categoryId: true,
    },
    where: {
      storeId: storeId,
    },
    orderBy: {
      _count: {
        categoryId: "desc",
      },
    },
    take: 1,
  });

  if (Productdata.length > 0) {
    const category = await db.category.findUnique({
      where: { id: Productdata[0].categoryId },
    });
    return {
      totalCategory: CategoryData._count,
      category: category?.name || "Unknown",
      productCount: Productdata[0]._count.categoryId,
    };
  }

  return { category: "None", productCount: 0, totalCategory: CategoryData._count };
}

async function getMvpUserData(storeId: string | undefined) {
  const users = await db.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      accessGrant: true,
      _count: { select: { sales: true } },
    },
    where: {
      role: "USER",
      storeId: storeId,
    },
    orderBy: { sales: { _count: "desc" } },
  });

  if (users.length === 0 || users[0]._count.sales === 0) return { username: "None", salesCount: 0 };
  return { username: users[0].username, salesCount: users[0]._count.sales };
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  const [salesData, userData, productData, todaySalesData, categoryData, mvpUserData] = await Promise.all([
    getSalesData(session?.user.storeId),
    getUserData(session?.user.storeId),
    getProductData(session?.user.storeId),
    getTodaySales(session?.user.storeId),
    getCategoryData(session?.user.storeId),
    getMvpUserData(session?.user.storeId),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader>Admin Dashboard</PageHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard title="Total Sales" subtitle={`${formatNumber(salesData.numberOfSales)} Sales`} body={formatCurrency(salesData.amount)} />
        <DashboardCard
          title="Total Users"
          subtitle={`${formatCurrency(userData.averageSalePerUser)} Average Sales Per User`}
          body={formatNumber(userData.userCount)}
        />
        <DashboardCard
          title="Active Products"
          subtitle={`${formatNumber(productData.inactiveCount)} Inactive`}
          body={formatNumber(productData.activeCount)}
        />
        <DashboardCard
          title="Total Categories"
          subtitle={`${categoryData.category} has highest No. of products ${formatNumber(categoryData.productCount)}`}
          body={formatNumber(categoryData.totalCategory)}
        />
        <DashboardCard
          title="Today's Sales"
          subtitle={`${formatNumber(todaySalesData.numberOfSales)} Sales`}
          body={formatCurrency(todaySalesData.amount)}
        />
        <DashboardCard title="Highest Seller" subtitle={`Has ${formatNumber(mvpUserData.salesCount)} total Sales`} body={mvpUserData.username} />
      </div>
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

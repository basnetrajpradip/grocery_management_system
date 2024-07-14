import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import db from "@/db/db";
import { formatCurrency, formatNumber } from "@/lib/formatters";

async function getSalesData() {
  const data = await db.sale.aggregate({
    _sum: { priceSoldInRs: true },
    _count: true,
  });

  return {
    amount: data._sum.priceSoldInRs || 0,
    numberOfSales: data._count,
  };
}

async function getUserData() {
  const [userCount, saleData] = await Promise.all([
    db.user.count(),
    db.sale.aggregate({
      _sum: { priceSoldInRs: true },
    }),
  ]);

  return {
    userCount,
    averageSalePerUser: userCount === 0 ? 0 : (saleData._sum.priceSoldInRs || 0) / userCount,
  };
}

async function getProductData() {
  const [activeCount, inactiveCount] = await Promise.all([
    db.product.count({ where: { isAvailableForPurchase: true } }),
    db.product.count({ where: { isAvailableForPurchase: false } }),
  ]);

  return { activeCount, inactiveCount };
}

async function wait() {
  return new Promise((resolve) => setTimeout(resolve, 3000));
}

export default async function AdminDashboard() {
  const [salesData, userData, productData] = await Promise.all([getSalesData(), getUserData(), getProductData()]);

  return (
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

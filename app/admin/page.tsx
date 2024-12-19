import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { prisma } from "@/prisma/connection";

async function getSalesData() {
    const data = await prisma.order.aggregate({ _sum: { pricePaid: true }, _count: true })
    return { amount: (data._sum.pricePaid || 0) / 100, numberOfSales: data._count }
}

async function getCustomerData() {
    const [customerCount, orderData] = await Promise.all([prisma.user.count(), prisma.order.aggregate({ _sum: { pricePaid: true } })])
    return { customerCount, averageValuePerUser: customerCount === 0 ? 0 : (orderData._sum.pricePaid || 0) / customerCount / 100 }

}

async function getProductData() {
    const [activeCount, inActiveCount] = await Promise.all([prisma.product.count({ where: { isAvailable: true } }), prisma.product.count({ where: { isAvailable: false } })])

    return { activeCount, inActiveCount }
}

const AdminDashboard = async () => {
    const [salesData, customerData, productData] = await Promise.all([getSalesData(), getCustomerData(), getProductData()])

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DashboardCard
                title="Sales"
                subtitle={`${formatNumber(salesData.numberOfSales)} Orders`}
                body={formatCurrency(salesData.amount)}
            />
            <DashboardCard
                title="Customer"
                subtitle={`${formatCurrency(customerData.averageValuePerUser)} Average Value`}
                body={formatNumber(customerData.customerCount)}
            />
            <DashboardCard
                title="Active Products"
                subtitle={`${formatNumber(productData.activeCount)} Inactive`}
                body={formatNumber(productData.inActiveCount)}
            />

        </div>
    )
}
type DashboardCardProps = {
    title: string
    subtitle: string
    body: string
}

function DashboardCard({ title, subtitle, body }: DashboardCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{subtitle}</CardDescription>
            </CardHeader>
            <CardContent>{body}</CardContent>
        </Card>
    )
}
export default AdminDashboard;

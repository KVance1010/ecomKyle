import Link from "next/link"
import PageHeader from "../_components/PageHeader"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { prisma } from "@/prisma/connection"
import { formatCurrency, formatNumber } from "@/lib/formatters"
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    ActiveToggleDropdownItem,
    DeleteDropdownItem,
} from "./_components/ProductActions"

async function ProductsTable() {
    const products = await prisma
        .product.findMany({ select: { id: true, name: true, price: true, isAvailable: true, _count: { select: { orders: true } } } })

    if (products.length === 0) {
        return <div>No products found.</div>
    }

    return (<Table>
        <TableHeader>
            <TableRow>
                <TableHead className="w-0"><span className="sr-only">Available for Purchase</span></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="w-0"><span className="sr-only">Actions</span></TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {products.map(product => (
                <TableRow key={product.id}>
                    <TableCell>
                        {product.isAvailable ? (
                            <>
                                <span className="sr-only">Available</span>
                                <CheckCircle2 />
                            </>
                        ) : (
                            <>
                                <span className="sr-only">Unavailable</span>
                                <XCircle className="stroke-destructive" />
                            </>
                        )}
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{formatCurrency(product.price / 100)}</TableCell>
                    <TableCell>{formatNumber(product._count.orders)}</TableCell>
                    <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <MoreVertical />
                                <span className="sr-only">Actions</span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem asChild>
                                    <a download href={`/admin/products/${product.id}/download`}>
                                        Download
                                    </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={`/admin/products/${product.id}/edit`}>
                                        Edit
                                    </Link>
                                </DropdownMenuItem>
                                <ActiveToggleDropdownItem
                                    id={product.id}
                                    isAvailable={product.isAvailable}
                                />
                                <DropdownMenuSeparator />
                                <DeleteDropdownItem
                                    id={product.id}
                                    disabled={product._count.orders > 0}
                                />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>)
}

const page = () => {
    return (
        <>
            <div className="flex justify-between items-center gap-4">
                <PageHeader>Products</PageHeader>
                <Button asChild><Link href="/admin/products/new">Add Product</Link></Button>
            </div>
            <ProductsTable />
        </>
    )
}

export default page


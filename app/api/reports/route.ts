import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const reports = await prisma.report.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error("Reports GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin only" }, { status: 403 });
    }

    const userId = session.user.id;
    const { type } = await req.json();

    const products = await prisma.product.findMany({
      where: { userId },
      include: { category: true },
    });

    const categories = await prisma.category.findMany({
      where: { userId },
      include: { products: true },
    });

    let title = "";
    let description = "";
    let data: unknown = null;

    switch (type) {
      case "category_performance": {
        title = "Category Performance Analysis";
        description = `Analysis of ${categories.length} product categories and their inventory performance.`;
        data = categories.map((cat) => ({
          category: cat.name,
          productCount: cat.products.length,
          totalQuantity: cat.products.reduce((s, p) => s + p.quantity, 0),
          totalValue: cat.products.reduce((s, p) => s + p.price * p.quantity, 0),
          avgPrice:
            cat.products.length > 0
              ? cat.products.reduce((s, p) => s + p.price, 0) / cat.products.length
              : 0,
        }));
        break;
      }
      case "inventory_value": {
        title = "Inventory Value Report";
        description = `Total inventory valuation report for ${products.length} products.`;
        const totalValue = products.reduce((s, p) => s + p.price * p.quantity, 0);
        const totalCost = products.reduce((s, p) => s + p.costPrice * p.quantity, 0);
        data = {
          totalValue,
          totalCost,
          potentialProfit: totalValue - totalCost,
          productBreakdown: products.map((p) => ({
            name: p.name,
            sku: p.sku,
            quantity: p.quantity,
            unitPrice: p.price,
            totalValue: p.price * p.quantity,
            category: p.category.name,
          })),
        };
        break;
      }
      case "low_stock_alerts": {
        const lowStockProducts = products.filter((p) => p.quantity <= p.minimumStock);
        title = "Low Stock Alerts Report";
        description = `${lowStockProducts.length} products need attention.`;
        data = lowStockProducts.map((p) => ({
          name: p.name,
          sku: p.sku,
          quantity: p.quantity,
          minimumStock: p.minimumStock,
          category: p.category.name,
          status: p.quantity === 0 ? "Out of Stock" : "Low Stock",
          reorderQty: p.minimumStock - p.quantity + 10,
          reorderCost: p.costPrice * Math.max(0, p.minimumStock - p.quantity + 10),
        }));
        break;
      }
      case "stock_status": {
        title = "Stock Status Distribution";
        description = "Overview of stock levels across all inventory items.";
        const inStock = products.filter((p) => p.quantity > p.minimumStock).length;
        const lowStock = products.filter((p) => p.quantity > 0 && p.quantity <= p.minimumStock).length;
        const outOfStock = products.filter((p) => p.quantity === 0).length;
        data = {
          inStock,
          lowStock,
          outOfStock,
          total: products.length,
          distribution: products.length > 0 ? [
            { status: "In Stock", count: inStock, percentage: Math.round((inStock / products.length) * 100) },
            { status: "Low Stock", count: lowStock, percentage: Math.round((lowStock / products.length) * 100) },
            { status: "Out of Stock", count: outOfStock, percentage: Math.round((outOfStock / products.length) * 100) },
          ] : [],
        };
        break;
      }
      case "sales_report": {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const sales = await prisma.sale.findMany({
          where: { userId, createdAt: { gte: thirtyDaysAgo } },
          include: { product: { include: { category: true } } },
        });
        title = "Sales Report (Last 30 Days)";
        description = `${sales.length} sales transactions recorded in the last 30 days.`;
        const totalRevenue = sales.reduce((s, sale) => s + sale.priceAtSale * sale.quantity, 0);
        const byProduct = sales.reduce(
          (acc, sale) => {
            const key = sale.productId;
            if (!acc[key])
              acc[key] = { name: sale.product.name, sku: sale.product.sku, category: sale.product.category.name, units: 0, revenue: 0 };
            acc[key].units += sale.quantity;
            acc[key].revenue += sale.priceAtSale * sale.quantity;
            return acc;
          },
          {} as Record<string, { name: string; sku: string; category: string; units: number; revenue: number }>
        );
        data = {
          totalRevenue,
          totalTransactions: sales.length,
          totalUnitsSold: sales.reduce((s, sale) => s + sale.quantity, 0),
          productBreakdown: Object.values(byProduct).sort((a, b) => b.revenue - a.revenue),
        };
        break;
      }
      default:
        return NextResponse.json({ error: "Invalid report type" }, { status: 400 });
    }

    const report = await prisma.report.create({
      data: { userId, title, description, type, data: data as object },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("Reports POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

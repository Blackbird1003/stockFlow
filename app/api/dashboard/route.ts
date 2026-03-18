import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.user.id;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [products, categories, sales30d, salesLast7d] = await Promise.all([
      prisma.product.findMany({ where: { userId }, include: { category: true } }),
      prisma.category.findMany({ where: { userId }, include: { products: true } }),
      prisma.sale.findMany({ where: { userId, createdAt: { gte: thirtyDaysAgo } }, include: { product: true } }),
      prisma.sale.findMany({ where: { userId, createdAt: { gte: sevenDaysAgo } } }),
    ]);

    const totalProducts = products.length;
    const outOfStock = products.filter((p) => p.quantity === 0).length;
    const lowStock = products.filter((p) => p.quantity > 0 && p.quantity <= p.minimumStock).length;
    const inStock = products.filter((p) => p.quantity > p.minimumStock).length;
    const totalInventoryValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
    const avgStockLevel = totalProducts > 0 ? Math.round(products.reduce((sum, p) => sum + p.quantity, 0) / totalProducts) : 0;
    const avgProductPrice = totalProducts > 0 ? products.reduce((sum, p) => sum + p.price, 0) / totalProducts : 0;
    const reorderCost = products
      .filter((p) => p.quantity <= p.minimumStock)
      .reduce((sum, p) => sum + p.costPrice * Math.max(0, p.minimumStock - p.quantity + 10), 0);
    const stockHealthScore = totalProducts > 0 ? Math.round((inStock / totalProducts) * 100) : 100;

    const totalSalesValue = sales30d.reduce((s, sale) => s + sale.priceAtSale * sale.quantity, 0);
    const totalUnitsSold = sales30d.reduce((s, sale) => s + sale.quantity, 0);

    const productSalesMap: Record<string, { name: string; sku: string; units: number; revenue: number }> = {};
    for (const sale of sales30d) {
      if (!productSalesMap[sale.productId]) {
        productSalesMap[sale.productId] = { name: sale.product.name, sku: sale.product.sku, units: 0, revenue: 0 };
      }
      productSalesMap[sale.productId].units += sale.quantity;
      productSalesMap[sale.productId].revenue += sale.priceAtSale * sale.quantity;
    }
    const bestSellers = Object.values(productSalesMap).sort((a, b) => b.units - a.units).slice(0, 5);

    const dailySales: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dailySales[d.toISOString().split("T")[0]] = 0;
    }
    for (const sale of salesLast7d) {
      const day = sale.createdAt.toISOString().split("T")[0];
      if (day in dailySales) dailySales[day] += sale.priceAtSale * sale.quantity;
    }
    const salesTrend = Object.entries(dailySales).map(([date, value]) => ({ date, value }));

    const soldProductIds = new Set(sales30d.map((s) => s.productId));
    const slowMovers = products
      .filter((p) => p.quantity > 0 && !soldProductIds.has(p.id))
      .slice(0, 5)
      .map((p) => ({ id: p.id, name: p.name, quantity: p.quantity, category: p.category.name }));

    const categoryData = categories.map((cat) => ({
      name: cat.name,
      products: cat.products.length,
      totalQuantity: cat.products.reduce((sum, p) => sum + p.quantity, 0),
    }));

    const stockStatusData = [
      { name: "In Stock", value: inStock, color: "#22c55e" },
      { name: "Low Stock", value: lowStock, color: "#f59e0b" },
      { name: "Out of Stock", value: outOfStock, color: "#ef4444" },
    ];

    const lowStockAlerts = products
      .filter((p) => p.quantity <= p.minimumStock)
      .map((p) => ({
        id: p.id,
        name: p.name,
        quantity: p.quantity,
        minimumStock: p.minimumStock,
        category: p.category.name,
        status: p.quantity === 0 ? "out_of_stock" : "low_stock",
      }))
      .sort((a, b) => a.quantity - b.quantity)
      .slice(0, 10);

    return NextResponse.json({
      stats: {
        totalProducts,
        lowStock,
        outOfStock,
        totalInventoryValue,
        avgStockLevel,
        stockHealthScore,
        reorderCost,
        avgProductPrice,
        totalSalesValue,
        totalUnitsSold,
      },
      categoryData,
      stockStatusData,
      lowStockAlerts,
      salesAnalytics: { bestSellers, salesTrend, slowMovers },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

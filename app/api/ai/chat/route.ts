import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

const formatNGN = (v: number) =>
  `₦${v.toLocaleString("en-NG", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { message } = await req.json();
    if (!message?.trim()) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set");
      return NextResponse.json({ error: "AI service not configured" }, { status: 500 });
    }

    const userId = session.user.id;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Fetch live inventory data
    const [products, sales30d, categories] = await Promise.all([
      prisma.product.findMany({
        where: { userId },
        include: { category: true },
        orderBy: { quantity: "asc" },
      }),
      prisma.sale.findMany({
        where: { userId, createdAt: { gte: thirtyDaysAgo } },
        include: { product: true },
      }),
      prisma.category.findMany({ where: { userId } }),
    ]);

    // Compute key metrics
    const totalProducts = products.length;
    const outOfStock = products.filter((p) => p.quantity === 0);
    const lowStock = products.filter((p) => p.quantity > 0 && p.quantity <= p.minimumStock);
    const totalInventoryValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
    const totalCostValue = products.reduce((sum, p) => sum + p.costPrice * p.quantity, 0);
    const stockHealthScore =
      totalProducts > 0
        ? Math.round(
            (products.filter((p) => p.quantity > p.minimumStock).length / totalProducts) * 100
          )
        : 100;

    // Sales aggregation
    const productSalesMap: Record<string, { name: string; units: number; revenue: number }> = {};
    for (const sale of sales30d) {
      if (!productSalesMap[sale.productId]) {
        productSalesMap[sale.productId] = { name: sale.product.name, units: 0, revenue: 0 };
      }
      productSalesMap[sale.productId].units += sale.quantity;
      productSalesMap[sale.productId].revenue += sale.priceAtSale * sale.quantity;
    }
    const bestSellers = Object.values(productSalesMap)
      .sort((a, b) => b.units - a.units)
      .slice(0, 5);

    const totalRevenue30d = sales30d.reduce((s, sale) => s + sale.priceAtSale * sale.quantity, 0);
    const totalUnitsSold30d = sales30d.reduce((s, sale) => s + sale.quantity, 0);

    const soldIds = new Set(sales30d.map((s) => s.productId));
    const slowMovers = products.filter((p) => p.quantity > 0 && !soldIds.has(p.id)).slice(0, 5);

    const fullPrompt = `You are Blackbird, an AI business assistant built into StockFlow, an inventory management platform. You are speaking directly to the business owner or manager.

Your role: Give clear, practical, data-driven advice based on their live inventory. Be concise (under 180 words unless a breakdown is needed), friendly but professional. Use plain text only, no markdown formatting, no bullet asterisks, no headers. Use the Naira symbol for currency.

LIVE INVENTORY SNAPSHOT:
Total Products: ${totalProducts}
Categories: ${categories.map((c) => c.name).join(", ") || "None"}
Inventory Value (at selling price): ${formatNGN(totalInventoryValue)}
Inventory Cost: ${formatNGN(totalCostValue)}
Gross Profit Potential: ${formatNGN(totalInventoryValue - totalCostValue)}
Stock Health Score: ${stockHealthScore}%

OUT OF STOCK (${outOfStock.length} items):
${outOfStock.length === 0 ? "None" : outOfStock.map((p) => `${p.name} (SKU: ${p.sku}, Min: ${p.minimumStock})`).join(", ")}

LOW STOCK (${lowStock.length} items):
${lowStock.length === 0 ? "None" : lowStock.map((p) => `${p.name} (Qty: ${p.quantity}, Min: ${p.minimumStock})`).join(", ")}

ALL PRODUCTS:
${products.map((p) => `${p.name} | ${p.category.name} | Qty: ${p.quantity} | Price: ${formatNGN(p.price)} | Cost: ${formatNGN(p.costPrice)}`).join("\n")}

SALES LAST 30 DAYS:
Revenue: ${formatNGN(totalRevenue30d)}, Units Sold: ${totalUnitsSold30d}, Transactions: ${sales30d.length}

TOP SELLERS (last 30 days):
${bestSellers.length === 0 ? "No sales recorded yet." : bestSellers.map((b, i) => `${i + 1}. ${b.name}: ${b.units} units, ${formatNGN(b.revenue)}`).join("; ")}

SLOW MOVERS (in stock, no sales in 30 days):
${slowMovers.length === 0 ? "None" : slowMovers.map((p) => `${p.name} (Qty: ${p.quantity})`).join(", ")}

User question: ${message}`;

    // Call Gemini REST API directly — no SDK dependency
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: {
            maxOutputTokens: 1024,
            temperature: 0.7,
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errBody = await geminiRes.text();
      console.error("Gemini API error:", geminiRes.status, errBody);
      return NextResponse.json({ error: "AI service error" }, { status: 500 });
    }

    const geminiData = await geminiRes.json();
    const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error("Unexpected Gemini response shape:", JSON.stringify(geminiData));
      return NextResponse.json({ error: "No response from AI" }, { status: 500 });
    }

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error("Blackbird AI error:", error);
    return NextResponse.json({ error: "Failed to get AI response" }, { status: 500 });
  }
}

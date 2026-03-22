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

    // Pre-compute per-product margins for the prompt
    const productMargins = products.map((p) => {
      const margin = p.price > 0 ? Math.round(((p.price - p.costPrice) / p.price) * 100) : 0;
      return { name: p.name, category: p.category.name, qty: p.quantity, price: p.price, costPrice: p.costPrice, margin };
    });

    const fullPrompt = `You are Blackbird, a senior business advisor and inventory specialist embedded in StockFlow, an inventory management platform for small and growing businesses in Nigeria.

You have deep expertise in: retail strategy, inventory management, cash flow optimisation, sales growth, pricing strategy, and Nigerian small business operations (market days, WhatsApp marketing, community selling, bulk deals).

COMMUNICATION RULES:
- Speak as a trusted, experienced advisor — warm, direct, and practical
- Plain text only. No markdown, no asterisks, no bullet symbols, no headers with hash signs
- Use ₦ for all currency values
- Be concise (under 200 words) unless a full breakdown is genuinely needed
- Always ground your advice in the actual data provided below

BUSINESS INTELLIGENCE RULES — follow these strictly based on what the user is asking:

IF the user asks about INCREASING SALES, GROWING the business, or MAKING MORE MONEY:
- Lead with MARKETING strategies: post on Instagram/Facebook/TikTok, use WhatsApp status and broadcast lists, run referral discounts, partner with local market traders, offer buy-2-get-1 deals
- Push the TOP SELLERS harder — these are proven products customers already want; invest your reorder budget and ad spend here
- Suggest running a flash sale or discount on slow movers to convert dead stock into cash — but do NOT recommend restocking slow movers as a growth strategy
- Mention pricing tactics: loyalty discounts for repeat buyers, bundle a slow mover with a best seller at a slight discount
- NEVER say "restock your slow-moving items" as a way to grow sales — that is wrong and destroys cash flow

IF the user asks WHAT TO RESTOCK or WHAT TO ORDER:
- Only recommend restocking products that are in the TOP SELLERS list OR are critically out of stock and previously had sales
- For slow movers (no sales in 30 days): explicitly advise to STOP reordering them until existing stock is sold
- Use the minimum stock threshold as the reorder trigger for proven sellers

IF the user asks about SLOW-MOVING or DEAD STOCK:
- Recommend: run a 10–30% clearance discount, bundle with a best seller, post a WhatsApp flash sale, or offer a market-day special
- Advise stopping all new orders for these products until stock clears
- Reframe dead stock as trapped cash that needs to be freed

IF the user asks about PROFIT or MARGINS:
- Use the pre-calculated margin percentages in the product data below
- High margin + high sales = star product, protect this stock level at all costs
- High margin + low sales = good product that needs marketing push
- Low margin + high sales = volume game, watch your costs carefully
- Low margin + low sales = consider discontinuing this product line
- Gross profit potential = inventory value minus cost — this is unrealised profit sitting in your warehouse

IF the user asks about GENERAL BUSINESS HEALTH or STRATEGY:
- Apply ABC analysis: the top 20% of products by revenue are your "A" products — focus all attention here
- Stock health below 70% means too many items are at or below minimum — reorder the top sellers urgently
- Idle stock is trapped capital; every week it sits unsold it loses value
- Encourage the owner to track which products sell fastest and build their brand around those

---

LIVE BUSINESS DATA (use this to give specific, personalised advice):

Business Overview:
Total Products: ${totalProducts}
Categories: ${categories.map((c) => c.name).join(", ") || "None"}
Inventory Value (selling price): ${formatNGN(totalInventoryValue)}
Inventory Cost: ${formatNGN(totalCostValue)}
Gross Profit Potential: ${formatNGN(totalInventoryValue - totalCostValue)}
Stock Health Score: ${stockHealthScore}% ${stockHealthScore < 70 ? "(WARNING: below healthy threshold)" : "(healthy)"}

Out of Stock (${outOfStock.length} items): ${outOfStock.length === 0 ? "None" : outOfStock.map((p) => p.name).join(", ")}
Low Stock (${lowStock.length} items): ${lowStock.length === 0 ? "None" : lowStock.map((p) => `${p.name} (${p.quantity} left, min ${p.minimumStock})`).join(", ")}

All Products (name | category | qty | price | cost | margin):
${productMargins.map((p) => `${p.name} | ${p.category} | Qty: ${p.qty} | ${formatNGN(p.price)} | Cost: ${formatNGN(p.costPrice)} | Margin: ${p.margin}%`).join("\n")}

Sales Performance (last 30 days):
Revenue: ${formatNGN(totalRevenue30d)} | Units Sold: ${totalUnitsSold30d} | Transactions: ${sales30d.length}

Top Sellers (last 30 days — proven demand, prioritise these):
${bestSellers.length === 0 ? "No sales recorded yet — focus on marketing to generate first sales." : bestSellers.map((b, i) => `${i + 1}. ${b.name}: ${b.units} units sold, ${formatNGN(b.revenue)} revenue`).join("\n")}

Slow Movers (in stock but zero sales in 30 days — do NOT restock these):
${slowMovers.length === 0 ? "None — all stocked products have recent sales. Great position!" : slowMovers.map((p) => `${p.name} (${p.quantity} in stock)`).join(", ")}

---

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

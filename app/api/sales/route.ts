import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createStockNotification } from "@/lib/notifications";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");

    const sales = await prisma.sale.findMany({
      where: { userId: session.user.id },
      include: { product: { include: { category: true } } },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json(sales);
  } catch (error) {
    console.error("Sales GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.user.id;
    const { productId, quantity } = await req.json();

    if (!productId || !quantity || quantity <= 0) {
      return NextResponse.json({ error: "productId and quantity > 0 required" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: productId, userId } });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    if (product.quantity < quantity) {
      return NextResponse.json({ error: `Insufficient stock. Available: ${product.quantity}` }, { status: 409 });
    }

    const newQty = product.quantity - quantity;

    const [sale] = await prisma.$transaction([
      prisma.sale.create({
        data: { userId, productId, quantity, priceAtSale: product.price, source: "manual" },
        include: { product: true },
      }),
      prisma.product.update({
        where: { id: productId },
        data: { quantity: newQty },
      }),
      prisma.inventoryLog.create({
        data: {
          userId,
          productId,
          action: "Sale",
          quantityChange: -quantity,
          previousQty: product.quantity,
          newQty,
        },
      }),
    ]);

    if (newQty <= product.minimumStock) {
      await createStockNotification(userId, { id: product.id, name: product.name, quantity: newQty, minimumStock: product.minimumStock });
    }

    return NextResponse.json(sale, { status: 201 });
  } catch (error) {
    console.error("Sales POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.user.id;
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId") || "";
    const status = searchParams.get("status") || "";

    const products = await prisma.product.findMany({
      where: {
        userId,
        AND: [
          search
            ? {
                OR: [
                  { name: { contains: search, mode: "insensitive" } },
                  { sku: { contains: search, mode: "insensitive" } },
                ],
              }
            : {},
          categoryId ? { categoryId } : {},
        ],
      },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    const filtered =
      status === "in_stock"
        ? products.filter((p) => p.quantity > p.minimumStock)
        : status === "low_stock"
        ? products.filter((p) => p.quantity > 0 && p.quantity <= p.minimumStock)
        : status === "out_of_stock"
        ? products.filter((p) => p.quantity === 0)
        : products;

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("Products GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.user.id;
    const body = await req.json();
    const { name, categoryId, sku, price, costPrice, quantity, minimumStock, description, imageUrl } = body;

    if (!name || !categoryId || !sku || price == null || costPrice == null || quantity == null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        userId,
        name,
        categoryId,
        sku,
        price: parseFloat(price),
        costPrice: parseFloat(costPrice),
        quantity: parseInt(quantity),
        minimumStock: parseInt(minimumStock || 10),
        description,
        imageUrl,
      },
      include: { category: true },
    });

    await prisma.inventoryLog.create({
      data: {
        userId,
        productId: product.id,
        action: "Product Added",
        quantityChange: product.quantity,
        previousQty: 0,
        newQty: product.quantity,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: unknown) {
    console.error("Products POST error:", error);
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json({ error: "SKU already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

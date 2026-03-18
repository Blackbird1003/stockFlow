import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createStockNotification } from "@/lib/notifications";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id, userId: session.user.id },
      include: { category: true, logs: { orderBy: { createdAt: "desc" }, take: 10 } },
    });

    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    console.error("Product GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.user.id;
    const { id } = await params;
    const body = await req.json();
    const { name, categoryId, sku, price, costPrice, quantity, minimumStock, description, imageUrl } = body;

    const existing = await prisma.product.findUnique({ where: { id, userId } });
    if (!existing) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const newQty = quantity !== undefined ? parseInt(quantity) : existing.quantity;
    const qtyChanged = newQty - existing.quantity;
    const effectiveMin = minimumStock !== undefined ? parseInt(minimumStock) : existing.minimumStock;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: name || existing.name,
        categoryId: categoryId || existing.categoryId,
        sku: sku || existing.sku,
        price: price !== undefined ? parseFloat(price) : existing.price,
        costPrice: costPrice !== undefined ? parseFloat(costPrice) : existing.costPrice,
        quantity: newQty,
        minimumStock: effectiveMin,
        description: description !== undefined ? description : existing.description,
        imageUrl: imageUrl !== undefined ? imageUrl : existing.imageUrl,
      },
      include: { category: true },
    });

    let action = "Product Updated";
    if (qtyChanged > 0) action = "Stock Increased";
    if (qtyChanged < 0) action = "Stock Reduced";

    await prisma.inventoryLog.create({
      data: {
        userId,
        productId: id,
        action,
        quantityChange: qtyChanged,
        previousQty: existing.quantity,
        newQty,
      },
    });

    if (newQty <= effectiveMin) {
      await createStockNotification(userId, {
        id: product.id,
        name: product.name,
        quantity: newQty,
        minimumStock: effectiveMin,
      });
    }

    return NextResponse.json(product);
  } catch (error: unknown) {
    console.error("Product PUT error:", error);
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

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin only" }, { status: 403 });
    }

    const userId = session.user.id;
    const { id } = await params;
    const product = await prisma.product.findUnique({ where: { id, userId } });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    await prisma.inventoryLog.create({
      data: {
        userId,
        productId: id,
        action: "Product Deleted",
        quantityChange: -product.quantity,
        previousQty: product.quantity,
        newQty: 0,
      },
    });

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Product DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const location = await prisma.location.findUnique({
      where: { id, userId: session.user.id },
      include: {
        products: {
          include: { product: { include: { category: true } } },
          orderBy: { quantity: "desc" },
        },
      },
    });

    if (!location) return NextResponse.json({ error: "Location not found" }, { status: 404 });
    return NextResponse.json(location);
  } catch (error) {
    console.error("Location stock GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Upsert product quantity at a specific location
// Also syncs product.quantity to sum of all its location quantities
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: locationId } = await params;
    const { productId, quantity } = await req.json();

    if (!productId || quantity == null || quantity < 0) {
      return NextResponse.json({ error: "productId and quantity >= 0 required" }, { status: 400 });
    }

    const location = await prisma.location.findUnique({ where: { id: locationId, userId: session.user.id } });
    if (!location) return NextResponse.json({ error: "Location not found" }, { status: 404 });

    const product = await prisma.product.findUnique({ where: { id: productId, userId: session.user.id } });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    // Upsert the location quantity
    await prisma.productLocation.upsert({
      where: { productId_locationId: { productId, locationId } },
      update: { quantity: parseInt(quantity) },
      create: { productId, locationId, quantity: parseInt(quantity) },
    });

    // Sync product.quantity = sum of all location quantities
    const allLocationQtys = await prisma.productLocation.aggregate({
      where: { productId },
      _sum: { quantity: true },
    });
    const totalQty = allLocationQtys._sum.quantity ?? 0;

    await prisma.product.update({ where: { id: productId }, data: { quantity: totalQty } });

    return NextResponse.json({ success: true, totalQuantity: totalQty });
  } catch (error) {
    console.error("Location stock POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

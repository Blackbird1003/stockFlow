import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin only" }, { status: 403 });
    }

    const { id } = await params;
    const { name, description } = await req.json();

    const existing = await prisma.category.findUnique({ where: { id, userId: session.user.id } });
    if (!existing) return NextResponse.json({ error: "Category not found" }, { status: 404 });

    const category = await prisma.category.update({
      where: { id },
      data: { name, description },
    });

    return NextResponse.json(category);
  } catch (error: unknown) {
    console.error("Category PUT error:", error);
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json({ error: "Category name already exists" }, { status: 409 });
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

    const { id } = await params;

    const existing = await prisma.category.findUnique({ where: { id, userId: session.user.id } });
    if (!existing) return NextResponse.json({ error: "Category not found" }, { status: 404 });

    const count = await prisma.product.count({ where: { categoryId: id, userId: session.user.id } });
    if (count > 0) {
      return NextResponse.json(
        { error: `Cannot delete: category has ${count} product(s). Move them first.` },
        { status: 409 }
      );
    }

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ message: "Category deleted" });
  } catch (error) {
    console.error("Category DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { name, description } = await req.json();

    const existing = await prisma.location.findUnique({ where: { id, userId: session.user.id } });
    if (!existing) return NextResponse.json({ error: "Location not found" }, { status: 404 });

    const location = await prisma.location.update({ where: { id }, data: { name, description } });
    return NextResponse.json(location);
  } catch (error: unknown) {
    console.error("Location PUT error:", error);
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json({ error: "Location name already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const existing = await prisma.location.findUnique({ where: { id, userId: session.user.id } });
    if (!existing) return NextResponse.json({ error: "Location not found" }, { status: 404 });

    await prisma.location.delete({ where: { id } });
    return NextResponse.json({ message: "Location deleted" });
  } catch (error) {
    console.error("Location DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

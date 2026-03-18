import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const report = await prisma.report.findUnique({ where: { id, userId: session.user.id } });
    if (!report) return NextResponse.json({ error: "Report not found" }, { status: 404 });

    return NextResponse.json(report);
  } catch (error) {
    console.error("Report GET error:", error);
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
    const existing = await prisma.report.findUnique({ where: { id, userId: session.user.id } });
    if (!existing) return NextResponse.json({ error: "Report not found" }, { status: 404 });

    await prisma.report.delete({ where: { id } });
    return NextResponse.json({ message: "Report deleted" });
  } catch (error) {
    console.error("Report DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

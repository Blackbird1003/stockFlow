import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const locations = await prisma.location.findMany({
      where: { userId: session.user.id },
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(locations);
  } catch (error) {
    console.error("Locations GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Verify the user still exists in DB (guards against stale JWT after DB reset)
    const userExists = await prisma.user.findUnique({ where: { id: session.user.id }, select: { id: true } });
    if (!userExists) {
      return NextResponse.json({ error: "Session expired. Please sign out and sign back in." }, { status: 401 });
    }

    const { name, description } = await req.json();
    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const location = await prisma.location.create({
      data: { userId: session.user.id, name, description: description ?? null },
    });

    return NextResponse.json(location, { status: 201 });
  } catch (error: unknown) {
    console.error("Locations POST error:", error);
    if (typeof error === "object" && error !== null && "code" in error) {
      const code = (error as { code: string }).code;
      if (code === "P2002") {
        return NextResponse.json({ error: "A location with that name already exists." }, { status: 409 });
      }
      if (code === "P2003") {
        return NextResponse.json({ error: "Session expired. Please sign out and sign back in." }, { status: 401 });
      }
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

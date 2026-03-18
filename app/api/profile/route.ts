import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    // Update name
    if (body.name !== undefined) {
      if (!body.name.trim()) {
        return NextResponse.json({ error: "Name cannot be empty." }, { status: 400 });
      }
      await prisma.user.update({
        where: { id: session.user.id },
        data: { name: body.name.trim() },
      });
      return NextResponse.json({ success: true });
    }

    // Update avatar URL
    if (body.avatarUrl !== undefined) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { avatarUrl: body.avatarUrl || null },
      });
      return NextResponse.json({ success: true });
    }

    // Update password
    if (body.currentPassword !== undefined && body.newPassword !== undefined) {
      if (body.newPassword.length < 8) {
        return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });
      }
      const user = await prisma.user.findUnique({ where: { id: session.user.id } });
      if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });

      const isValid = await bcrypt.compare(body.currentPassword, user.password);
      if (!isValid) {
        return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
      }

      const hashed = await bcrypt.hash(body.newPassword, 10);
      await prisma.user.update({
        where: { id: session.user.id },
        data: { password: hashed },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  } catch (error) {
    console.error("Profile PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

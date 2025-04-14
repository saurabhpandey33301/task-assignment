// src/app/api/user/[id]/route.ts
import { prisma } from "@/app/lib/index";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: any }) {    // @ts-ignore
  const user = await prisma.user.findUnique({
    where: { id: params.id },
  });

  if (!user) {
    return NextResponse.json({ user: null }, { status: 404 });
  }

  return NextResponse.json({ user });
}

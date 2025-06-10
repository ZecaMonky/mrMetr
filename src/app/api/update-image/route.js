import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  const { productId, imageUrl } = await req.json();

  if (!productId || !imageUrl) {
    return NextResponse.json({ error: "Отсутствующие данные" }, { status: 400 });
  }

  const updated = await prisma.product.update({
    where: { id: productId },
    data: { image: imageUrl },
  });

  return NextResponse.json({ success: true, product: updated });
}

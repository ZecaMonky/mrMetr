import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Не указан userId" }, { status: 400 });
    }

    const wishlist = await prisma.wishlistItem.findMany({
      where: { userId: Number(userId) },
      include: { product: true },
    });

    return NextResponse.json(wishlist);
  } catch (error) {
    return NextResponse.json({ error: "Ошибка при получении избранного" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { userId, productId } = await req.json();

    if (!userId || !productId) {
      return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
    }

    const wishlistItem = await prisma.wishlistItem.create({
      data: { userId, productId },
    });

    return NextResponse.json(wishlistItem);
  } catch (error) {
    return NextResponse.json({ error: "Ошибка при добавлении в избранное" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { userId, productId } = await req.json();

    if (!userId || !productId) {
      return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
    }

    await prisma.wishlistItem.deleteMany({
      where: { userId, productId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Ошибка при удалении из избранного" }, { status: 500 });
  }
}

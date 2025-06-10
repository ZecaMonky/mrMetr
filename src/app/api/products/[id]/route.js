import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(req, { params }) {
  try {
  const { id } = await params;

    await prisma.product.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true, id }, { status: 200 });
  } catch (error) {
    console.error("Ошибка при удалении товара:", error);
    return NextResponse.json(
      { error: "Не удалось удалить товар", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ error: "Товар не найден" }, { status: 404 });
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error("Ошибка при получении товара:", error);
    return NextResponse.json(
      { error: "Ошибка сервера", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const { name, price, description } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID отсутствует" }, { status: 400 });
    }

    if (!name || !price) {
      return NextResponse.json(
        { error: "Название и цена обязательны" },
        { status: 400 }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        price: parseFloat(price),
        description: description || null,
      },
    });

    return NextResponse.json(
      { success: true, product: updatedProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error("Ошибка при обновлении товара:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Товар не найден" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Не удалось обновить товар", details: error.message },
      { status: 500 }
    );
  }
}
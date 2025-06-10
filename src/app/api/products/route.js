import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = req.nextUrl;
    const categoryId = searchParams.get("categoryId");
    const subcategoryId = searchParams.get("subcategoryId");
    const search = searchParams.get("search");

    const filters = {};

    if (categoryId) {
      filters.categoryId = categoryId;
    }

    if (subcategoryId) {
      filters.subcategoryId = subcategoryId;
    }

    if (search && typeof search === "string" && search.trim() !== "") {
      filters.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { sku: { contains: search } },
      ];
    }

    const products = await prisma.product.findMany({
      where: filters,
      include: {
        category: true,
        subcategory: true,
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products", details: error.message },
      { status: 500 }
    );
  }
}


export async function POST(req) {
  try {
    const body = await req.json();

    const newProduct = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        sku: body.sku,
        price: parseFloat(body.price),
        categoryId: body.categoryId || null,
        subcategoryId: body.subcategoryId || null,
      },
    });

    return NextResponse.json(newProduct);
  } catch (error) {
    console.error("Ошибка при добавлении товара:", error);
    return NextResponse.json(
      { error: "Не удалось добавить товар", details: error.message },
      { status: 500 }
    );
  }
}

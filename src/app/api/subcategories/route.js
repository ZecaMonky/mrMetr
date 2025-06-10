import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { name, categoryId } = await req.json();

    if (!name || name.trim() === "" || !categoryId) {
      return new Response(
        JSON.stringify({
          error: "Обязательны название подкатегории и идентификатор категории",
        }),
        { status: 400 }
      );
    }

    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      return new Response(
        JSON.stringify({ error: "Категория не найдена" }),
        { status: 404 }
      );
    }

    const newSubcategory = await prisma.subcategory.create({
      data: {
        name: name.trim(),
        categoryId,
      },
    });

    return new Response(JSON.stringify(newSubcategory), {
      status: 201,
    });
  } catch (error) {
    console.error("Ошибка при создании подкатегории:", error);
    return new Response(
      JSON.stringify({ error: "Не удалось создать подкатегорию" }),
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
    try {
      const { id } = await req.json();

      if (!id) {
        return new Response(JSON.stringify({ error: "Требуется ID" }), {
          status: 400,
        });
      }

      await prisma.subcategory.delete({
        where: { id },
      });

      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
      console.error("Ошибка при удалении подкатегории:", error);
      return new Response(
        JSON.stringify({ error: "Не удалось удалить подкатегорию" }),
        { status: 500 }
      );
    }
  }


  export async function PUT(req) {
    try {
      const { id, name, categoryId } = await req.json();

      if (!id || !name) {
        return new Response(
          JSON.stringify({ error: "Требуются id и имя" }),
          { status: 400 }
        );
      }

      const updated = await prisma.subcategory.update({
        where: { id },
        data: {
          name,
          ...(categoryId && { categoryId }),
        },
      });

      return new Response(JSON.stringify(updated), { status: 200 });
    } catch (error) {
      console.error("Ошибка при обновлении подкатегории:", error);
      return new Response(
        JSON.stringify({ error: "Не удалось обновить подкатегорию" }),
        { status: 500 }
      );
    }
  }

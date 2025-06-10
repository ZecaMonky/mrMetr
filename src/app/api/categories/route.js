import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subcategories: true,
      },
    });

    return new Response(JSON.stringify(categories), { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch categories' }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { name } = await req.json();

    if (!name || name.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'Category name is required' }),
        { status: 400 }
      );
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
      },
    });

    return new Response(JSON.stringify(newCategory), { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create category' }),
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return new Response(JSON.stringify({ error: "ID is required" }), {
        status: 400,
      });
    }

    await prisma.subcategory.deleteMany({
      where: { categoryId: id },
    });

    await prisma.category.delete({
      where: { id },
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error deleting category:", error);
    return new Response(JSON.stringify({ error: "Failed to delete category" }), {
      status: 500,
    });
  }
}

export async function PUT(req) {
  try {
    const { id, name } = await req.json();

    if (!id || !name) {
      return new Response(
        JSON.stringify({ error: "ID and name are required" }),
        { status: 400 }
      );
    }

    const updated = await prisma.category.update({
      where: { id },
      data: { name },
    });

    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (error) {
    console.error("Error updating category:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update category" }),
      { status: 500 }
    );
  }
}

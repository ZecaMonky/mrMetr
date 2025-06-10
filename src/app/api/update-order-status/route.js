import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return new Response(JSON.stringify({ error: "Отсутствует заказ или статус" }), {
        status: 400,
      });
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return new Response(JSON.stringify({ message: "Статус обновлен" }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Ошибка при обновлении" }), {
      status: 500,
    });
  }
}

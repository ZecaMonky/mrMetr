import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return new Response(JSON.stringify({ error: "Нет токена" }), { status: 401 });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return new Response(JSON.stringify({ error: "Невалидный токен" }), { status: 403 });
  }

  const { items, deliveryMethod, deliveryAddress } = await req.json();

  if (!items || !Array.isArray(items) || items.length === 0) {
    return new Response(JSON.stringify({ error: "Корзина пуста" }), { status: 400 });
  }

  if (!deliveryMethod || (deliveryMethod === "Доставка" && !deliveryAddress)) {
    return new Response(JSON.stringify({ error: "Неверный способ или адрес доставки" }), { status: 400 });
  }

  try {
    const order = await prisma.order.create({
      data: {
        userId: decoded.userId,
        deliveryMethod,
        deliveryAddress: deliveryMethod === "Доставка" ? deliveryAddress : null,
        items: {
          create: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity || 1,
          })),
        },
      },
      include: {
        items: { include: { product: true } },
      },
    });

    return new Response(JSON.stringify(order), { status: 201 });
  } catch (error) {
    console.error("Ошибка при создании заказа:", error);
    return new Response(JSON.stringify({ error: "Ошибка сервера" }), { status: 500 });
  }
}

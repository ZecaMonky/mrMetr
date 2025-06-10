import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import AdminPageClient from "./AdminPageClient";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

async function getData() {
  const products = await prisma.product.findMany();
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return { products, orders };
}

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.role !== "ADMIN") {
      redirect("/");
    }

    const { products, orders } = await getData();

    return <AdminPageClient products={products} orders={orders} />;
  } catch (err) {
    redirect("/login");
  }
}

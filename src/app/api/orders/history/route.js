import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return new Response(JSON.stringify({ error: 'Нет токена' }), { status: 401 })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)

    const orders = await prisma.order.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: { product: true }
        }
      }
    })

    return new Response(JSON.stringify(orders), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Ошибка авторизации' }), { status: 403 })
  }
}

import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('authToken')

  if (!token) {
    return new Response(JSON.stringify({ error: 'Необходима авторизация' }), { status: 401 })
  }

  try {
    const decoded = jwt.verify(token.value, JWT_SECRET)
    return new Response(JSON.stringify({ userId: decoded.userId, role: decoded.role }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Неверный токен' }), { status: 401 })
  }
}

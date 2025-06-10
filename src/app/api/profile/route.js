import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  const cookieStore = await cookies()
  const token = cookieStore.get('authToken')?.value

  if (!token) {
    return new Response(JSON.stringify({ error: 'Нет токена' }), { status: 401 })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return new Response(JSON.stringify({
      userId: decoded.userId,
      email: decoded.email,
      phone: decoded.phone,
      role: decoded.role
    }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Не валидный токен' }), { status: 403 })
  }
}

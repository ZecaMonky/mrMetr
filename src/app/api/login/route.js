import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    const { identifier, password } = await req.json()

    if (!identifier || !password) {
      return NextResponse.json({ error: 'Заполните все поля.' }, { status: 400 })
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { phone: identifier }]
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Неверные данные для входа.' }, { status: 400 })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return NextResponse.json({ error: 'Неверный пароль.' }, { status: 401 })
    }

    const token = jwt.sign({
      userId: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role
    }, JWT_SECRET, { expiresIn: '7d' })

    const response = NextResponse.json({
      message: 'Вход выполнен успешно',
      userId: user.id,
      role: user.role,
    })

    response.cookies.set('authToken', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error) {
    console.error('Ошибка входа:', error)
    return NextResponse.json({ error: 'Внутренняя ошибка сервера.' }, { status: 500 })
  }
}

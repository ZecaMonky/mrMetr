// src/app/api/register/route.js

import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function POST(request) {
  const body = await request.json()
  const { email, phone, password } = body

  if (!email || !password || !phone) {
    return new Response(JSON.stringify({ error: "Номер телефона, Email и пароль обязательны" }), {
      status: 400,
    })
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return new Response(JSON.stringify({ error: "Пользователь с таким email уже существует" }), {
      status: 409,
    })
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  const newUser = await prisma.user.create({
    data: {
      email,
      phone,
      password: hashedPassword,
    },
  })

  return new Response(JSON.stringify({ success: true, user: { email: newUser.email } }), {
    status: 201,
  })
}

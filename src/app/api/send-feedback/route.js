import nodemailer from 'nodemailer'

export async function POST(req) {
  try {
    const { name, email, message } = await req.json()

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Все поля обязательны' }), { status: 400 })
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'vladborsch9000@gmail.com',
      subject: 'Новое сообщение обратной связи',
      text: `
        📩 Новое сообщение с формы обратной связи:

        👤 Имя: ${name}
        📧 Email: ${email}

        💬 Сообщение:
        ${message}
            `,
    }

    await transporter.sendMail(mailOptions)

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (error) {
    console.error('Ошибка при отправке письма:', error)
    return new Response(JSON.stringify({ error: 'Не удалось отправить сообщение' }), { status: 500 })
  }
}

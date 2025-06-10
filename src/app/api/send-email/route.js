import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { user, cart, deliveryMethod, deliveryAddress, total } = await req.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });

    const itemsList = cart.map(item => {
    const quantity = item.quantity ?? 1;
    const price = Number(item.price) || 0;
    const total = quantity * price;
    return `• ${item.name || 'Без названия'} — ${quantity} шт × ${price} ₽ = ${total} ₽`;
    }).join('\n');

    const message = `
      Электронный чек "Метр"

      📧 Email: ${user.email}
      📞 Телефон: ${user.phone}

      📦 Способ получения: ${deliveryMethod}
      ${deliveryMethod === 'Доставка' ? `🏠 Адрес: ${deliveryAddress}` : ''}

      🛒 Товары:
      ${itemsList}

      💰 Итого: ${total} ₽

      По всем вопросам обращайтесь на электронную почту vladborsch9000@gmail.com
    `;

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: 'vladborsch9000@gmail.com',
        subject: 'Новый заказ с сайта',
        text: message,
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Ваш заказ принят!',
        text: `Здравствуйте!\n\nСпасибо за ваш заказ. Вот его детали:\n\n${message}`,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error) {
    console.error('Ошибка при отправке письма:', error);
    return new Response(JSON.stringify({ error: 'Не удалось отправить email' }), { status: 500 });
  }
}

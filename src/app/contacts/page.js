'use client';

import { Mail, Phone } from 'lucide-react';

import YandexMap from '../components/YandexMap';

export default function ContactPage() {
  return (
    <div className="container mx-auto w-full my-16 px-4 sm:px-0">
      <h1 className="text-3xl font-bold mb-6 sm:mb-10">Контактная информация</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-semibold mb-3">Информация по заказам и товарам</h2>
            <ul className="space-y-3 text-gray-700">
              <li>
                <a
                  href="https://vk.com/metr_stroymarket?ysclid=m9bgdtye35326211985"
                  className="text-blue-600 hover:underline"
                >
                  Метр Вконтакте
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} />{' '}
                <a href="tel:+73532430220" className="text-blue-600 hover:underline">+7 (3532) 43‒02‒20</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} />{' '}
                <a href="mailto:ooometr2020@mail.ru" className="text-blue-600 hover:underline">ooometr2020@mail.ru</a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Реквизиты компании</h2>
            <p className="text-gray-700 leading-relaxed">
              ООО &quot;МЕТР&quot;<br />
              ИНН 5609194270<br />
              КПП 560901001<br />
              ОГРН 1205600001485<br />
              Юр. адрес: 460044, Оренбург, ул. Березка, д. 2/4, помещ. 6
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Для оптовых клиентов</h2>
            <li className="flex items-center gap-2">
                <Phone size={18} />{' '}
                <a className="text-blue-600 hover:underline" href="tel:+79096147914">+7 (909) 614 79-14</a>
              </li>
            <p className="flex items-center text-gray-700">
              <Mail className="inline mr-2" size={18} />{' '}
              <a className="text-blue-600 hover:underline" href="mailto:metr.opt@mail.ru">metr.opt@mail.ru</a>
            </p>

          </section>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-3">Офис компании</h2>
            <p className="text-gray-700 leading-relaxed">
              460044, Оренбургская область, город Оренбург, ул. Березка, д. 2/4, помещ. 6<br />
              Время работы: 9:00 — 18:00, понедельник–пятница
            </p>
          </section>

          <div className="h-64 sm:h-96 w-full rounded shadow-md">
            <YandexMap />
          </div>
        </div>
      </div>
    </div>
  );
}

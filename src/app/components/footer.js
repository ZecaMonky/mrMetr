"use client";

import React from "react";

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#FFD452', bottom: 0, width: '100%' }} className="text-black py-6 px-4 sm:px-0">
      <div className="container mx-auto flex flex-wrap justify-between border-b-1 border-black pb-8">
        <div className="w-full sm:w-auto mb-6 sm:mb-0">
          <h3 className="text-lg font-semibold">Покупателям</h3>
          <ul className="mt-2 space-y-2">
            <li><a href="catalog" className="hover:underline">Услуги</a></li>
            <li><a href="#" className="hover:underline">Оплата</a></li>
            <li><a href="contacts" className="hover:underline">Магазины</a></li>
            <li><a href="#" className="hover:underline">Условия продажи</a></li>
            <li><a href="support" className="hover:underline">Вопросы и ответы</a></li>
          </ul>
        </div>

        <div className="w-full sm:w-auto mb-6 sm:mb-0">
          <h3 className="text-lg font-semibold">О компании</h3>
          <ul className="mt-2 space-y-2">
            <li><a href="#" className="hover:underline">О нас</a></li>
            <li><a href="contacts" className="hover:underline">Контакты</a></li>
            <li><a href="contacts" className="hover:underline">Магазины</a></li>
            <li><a href="contacts" className="hover:underline">Реквизиты</a></li>
          </ul>
        </div>

        <div className="w-full sm:w-1/2">
          <p className="text-sm mt-4">
            Цена и информация о наличии товара в интернет-магазине может отличаться от фактической цены и наличия в розничных магазинах Метр. Изображения товара могут в незначительной мере отличаться от их фактического вида.
          </p>
          <p className="text-sm mt-4">
            Материалы, представленные на сайте, защищены законом РФ об авторском праве. Копирование и распространение материалов сайта в интернете, а также несанкционированное использование материалов сайта в СМИ и прочих изданиях запрещено без предварительного письменного разрешения владельцев сайта.
          </p>
          <p className="text-sm mt-4">
            *Точное время доставки зависит от определенных факторов: город, удаленность от магазина, ситуация на дороге, погодные условия и др.
          </p>
        </div>
      </div>

      <div className="container mx-auto flex flex-wrap justify-between items-center mt-4 pb-2">
        <p className="text-sm text-center sm:text-left">&copy; {new Date().getFullYear()} «Метр» Все права защищены</p>

        <nav>
          <ul className="flex justify-center sm:justify-end space-x-6 text-sm font-semibold">
            <li><a href="#" className="hover:underline">Политика конфиденциальности</a></li>
            <li><a href="#" className="hover:underline">Условия использования</a></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;

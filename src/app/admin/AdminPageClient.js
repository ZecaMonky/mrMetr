'use client';

import { useState, useEffect } from 'react';

import AddProductForm from "../components/AddProductForm";
import AdminStats from "../components/AdminStats";
import OrderStatusForm from "../components/OrderStatusForm";
import ProductItem from "../components/ProductItem";

export default function AdminPageClient({ products, orders }) {
  const [search, setSearch] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);

  const [showProductsList, setShowProductsList] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showStats, setShowStats] = useState(false);


  useEffect(() => {
    const query = search.toLowerCase();
    setFilteredProducts(
      products.filter(p => p.name.toLowerCase().includes(query))
    );
  }, [search, products]);

  return (
    <div className="container mx-auto w-full mt-10 px-5 sm:px-0">
      <h1 className="text-2xl font-bold mb-4">Админ-панель</h1>

      <div className="flex flex-wrap gap-4 mb-6">

        <button
          onClick={() => setShowProductsList(!showProductsList)}
          className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md shadow"
        >
          {showProductsList ? 'Скрыть список товаров' : 'Показать список товаров'}
        </button>

        <button
          onClick={() => setShowOrders(!showOrders)}
          className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md shadow"
        >
          {showOrders ? 'Скрыть заказы' : 'Показать заказы'}
        </button>

        <button
          onClick={() => setShowStats(!showStats)}
          className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md shadow"
        >
          {showStats ? 'Скрыть статистику' : 'Показать статистику'}
        </button>
      </div>

        <AddProductForm />

      {showProductsList && (
        <div>
          <h2 className="text-xl font-semibold mt-6">Список товаров</h2>
          <input
            type="text"
            placeholder="Поиск по названию..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-2 mb-4 w-full p-2 border border-gray-400 focus:outline-none rounded-md shadow-sm"
          />
          <ul className="space-y-4">
            {filteredProducts.map((product) => (
              <ProductItem key={product.id} product={product} />
            ))}
            {filteredProducts.length === 0 && (
              <div className="text-gray-500">Ничего не найдено.</div>
            )}
          </ul>
        </div>
      )}

      {showOrders && (
        <div>
          <h2 className="text-xl font-semibold mt-6">Заказы</h2>
          <ul className="space-y-4">
            {orders.map((order) => (
              <li key={order.id} className="border border-gray-200 p-4 rounded-xl shadow">
                <div>
                  <strong>Заказ #{order.id}</strong>
                  <OrderStatusForm orderId={order.id} currentStatus={order.status} />
                </div>
                <div>
                  <span className="font-semibold">Пользователь:</span> {order.user.email}
                </div>
                <div>
                  <span className="font-semibold">Метод доставки:</span> {order.deliveryMethod}
                </div>
                {order.deliveryAddress && (
                  <div>
                    <span className="font-semibold">Адрес доставки:</span> {order.deliveryAddress}
                  </div>
                )}
                <div>
                  <span className="font-semibold">Товары:</span>
                  <ul className="pl-5 list-disc">
                    {order.items.map((item) => (
                      <li key={item.id}>
                        {item.product.name} – {item.quantity} шт. (₽{item.product.price * item.quantity})
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showStats && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mt-6 mb-2">Статистика заказов</h2>
          <AdminStats />
        </div>
      )}
    </div>
  );
}

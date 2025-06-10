'use client'

import Cookies from 'js-cookie'
import Image from "next/image";
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { FaTrash, FaHeart, FaRegHeart } from 'react-icons/fa'

export default function CartPage() {
  const [deliveryMethod, setDeliveryMethod] = useState('Самовывоз');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [apartmentNumber, setApartmentNumber] = useState('');
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const [favorites, setFavorites] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("favorites")) || [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);

    const token = Cookies.get('authToken');
    if (!token) {
      router.push('/login');
      return;
    }

    const userCookie = Cookies.get('user');
    if (userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        setUser(parsedUser);
      } catch (err) {
        console.error("Ошибка при разборе user из cookie:", err);
      }
    }
  }, [router]);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter(item => item.id !== productId);
    updateCart(newCart);
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    const newCart = cart.map(item =>
      item.id === productId ? { ...item, quantity } : item
    );
    updateCart(newCart);
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  };

  const getFormattedAddress = () => {
    return `${city ? `г. ${city}` : ''} ${street ? `ул. ${street}` : ''} ${houseNumber ? `дом ${houseNumber}` : ''}${apartmentNumber ? ` кв. ${apartmentNumber}` : ''}`;
  };

  const toggleFavorite = (product) => {
    setFavorites((prevFavorites) => {
      const isAlreadyFavorite = prevFavorites.some(fav => fav.id === product.id);
      if (isAlreadyFavorite) {
        return prevFavorites.filter(fav => fav.id !== product.id);
      } else {
        return [...prevFavorites, product];
      }
    });
  };

  const validateAddress = () => {
    let valid = true;
    const errors = {};

    if (deliveryMethod === 'Доставка') {
      if (!city) {
        errors.city = 'Укажите город';
        valid = false;
      }
      if (!street) {
        errors.street = 'Укажите улицу';
        valid = false;
      }
      if (!houseNumber) {
        errors.houseNumber = 'Укажите номер дома';
        valid = false;
      }
    }

    setErrors(errors);
    return valid;
  };

  const handleCheckout = async () => {
    const token = Cookies.get('authToken');
    if (!token) {
      alert('Вы не авторизованы');
      router.push('/login');
      return;
    }

    if (!validateAddress()) {
      alert('Пожалуйста, заполните все обязательные поля адреса');
      return;
    }

    const formattedAddress = deliveryMethod === 'Доставка' ? getFormattedAddress() : null;

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart,
          deliveryMethod,
          deliveryAddress: formattedAddress
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Ошибка оформления');
      }

      await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user,
          cart,
          deliveryMethod,
          deliveryAddress: formattedAddress,
          total: getTotal()
        })
      });

      alert('Заказ оформлен! Спасибо за покупку 😊');
      updateCart([]);
    } catch (err) {
      console.error('Ошибка при оформлении заказа:', err);
      alert('Не удалось оформить заказ. Попробуйте снова.');
    }
  };

  return (
    <div className="container mx-auto w-full mt-5 px-4 sm:px-0 sm:mt-10">
      <h1 className="text-2xl font-bold mb-4">Корзина</h1>

      {cart.length > 0 ? (
        <>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-4">
              {cart.map((product) => (
                <div
                  key={product.id}
                  className="border-1 border-gray-200 rounded-lg p-4 shadow-md grid grid-cols-1 sm:grid-cols-[1fr_auto_120px] gap-4 items-center"
                >
                  <div className="flex items-start">
                    <div className="w-24 h-24 relative mr-4">
                      <img
                        src={product.image || "/placeholder.png"}
                        alt={product.name}
                        fill="true"
                        className="object-contain rounded-md"
                      />
                    </div>
                    <div className="flex flex-col justify-start text-left">
                      <h2 className="text-lg font-semibold">{product.name}</h2>
                      <p className="text-sm text-gray-500">Артикул: {product.sku}</p>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center items-center">
                    <div className="flex items-center mb-1">
                      <button
                        onClick={() => updateQuantity(product.id, (product.quantity || 1) - 1)}
                        className="bg-gray-300 text-sky-700 px-2 py-1 rounded text-lg"
                      >
                        -
                      </button>
                      <span className="mx-2">{product.quantity || 1}</span>
                      <button
                        onClick={() => updateQuantity(product.id, (product.quantity || 1) + 1)}
                        className="bg-gray-300 text-sky-700 px-2 py-1 rounded text-lg"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm text-gray-700 whitespace-nowrap">
                      {product.price.toLocaleString()} ₽ / шт
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-4">
                    <span className="text-md font-semibold whitespace-nowrap">
                      {(product.price * (product.quantity || 1)).toLocaleString()} ₽
                    </span>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => toggleFavorite(product)}
                        className="text-red-500 hover:text-red-600"
                        title="В избранное"
                      >
                        {favorites.some((fav) => fav.id === product.id) ? (
                          <FaHeart className="text-pink-600" size={16} />
                        ) : (
                          <FaRegHeart className="text-gray-600 hover:text-pink-600" size={16} />
                        )}
                      </button>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-gray-500 hover:text-red-600"
                        title="Удалить"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="mt-10">
                <h2 className="text-xl font-semibold mb-4">Где и как вы хотите получить заказ?</h2>

                <div className="mb-4">
                  <label className="block font-semibold mb-2">Способ доставки:</label>
                  <select
                    value={deliveryMethod}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    className="border-1 border-gray-200 rounded px-3 py-2 w-full"
                  >
                    <option>Самовывоз</option>
                    <option>Доставка</option>
                  </select>
                </div>

                {deliveryMethod === "Доставка" && (
                  <div className="mb-4">
                    <label className="block font-semibold mb-2">Адрес доставки:</label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Город"
                        className="border-1 border-gray-200 rounded px-3 py-2 w-full"
                        required
                      />
                      <input
                        type="text"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="Улица"
                        className="border-1 border-gray-200 rounded px-3 py-2 w-full"
                        required
                      />
                      <input
                        type="number"
                        value={houseNumber}
                        onChange={(e) => setHouseNumber(e.target.value)}
                        placeholder="Дом"
                        className="border-1 border-gray-200 rounded px-3 py-2 w-full"
                        required
                      />
                      <input
                        type="number"
                        value={apartmentNumber}
                        onChange={(e) => setApartmentNumber(e.target.value)}
                        placeholder="Квартира*"
                        className="border-1 border-gray-200 rounded px-3 py-2 w-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full lg:w-[350px] flex-shrink-0">
              <div className="border-1 border-gray-200 rounded-lg p-6 shadow-md sticky top-20">
                <h2 className="text-xl font-semibold mb-4">Ваш заказ</h2>
                <div className="space-y-3 text-gray-800">

                  <div className="pt-3">
                    <span className="font-semibold">Покупатель:</span>
                    <p className="text-sm font-bold mt-1">
                      {user?.name && <>Имя: <span className="font-medium">{user.name}</span><br /></>}
                      Email: <span className="font-medium">{user?.email || 'Не указано'}</span><br />
                      Телефон: <span className="font-medium">{user?.phone || 'Не указано'}</span>
                    </p>
                  </div>

                  <div className="border-t pt-3">
                    <span className="font-semibold">Способ получения:</span>
                    {deliveryMethod === "Самовывоз" ? (
                      <div className="mt-1 text-sm">
                        <p>г. Оренбург, ул. Берёзка, 2/4</p>
                        <p>Пн - Вс: 9:00 - 21:00</p>
                      </div>
                    ) : (
                      <p className="mt-1 text-sm">
                        Доставка по адресу: <br />
                        {getFormattedAddress()}
                      </p>
                    )}
                  </div>

                  <div className="border-t py-3">
                    <span className="font-semibold">Контакты магазина:</span>
                    <p className="text-sm font-bold mt-1">
                      Телефон: <span className="font-medium">+7 (3532) 43‒02‒20</span><br />
                      Email: <span className="font-medium">admin2@example.com</span>
                    </p>
                  </div>
                </div>

                <div className="flex justify-between text-xl font-bold border-t pt-3">
                    <span>Итого</span>
                    <span>{getTotal().toLocaleString()} ₽</span>
                </div>
                {deliveryMethod === "Доставка" && (
                  <div>
                    <span className="text-sm text-gray-600">Мы отправим ваш заказ, как только ваш заказ обработается</span>
                  </div>
                )}
                <button
                  onClick={handleCheckout}
                  className="mt-6 w-full bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
                >
                  Оформить заказ
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-10">
          <img
            src="cart-background.png"
            alt="Корзина пуста"
            className="w-128 h-96 object-contain mb-6"
          />
          <p className="text-xl font-semibold mb-2">В вашей корзине пока нет товаров</p>
          <p className="text-gray-500 mb-4">
            Воспользуйтесь каталогом, чтобы найти всё, что вам нужно
          </p>
          <Link
            href="/catalog"
            className="px-6 py-3 text-white rounded-md bg-sky-600 hover:bg-sky-700 transition"
          >
            Вернуться к покупкам
          </Link>
        </div>
      )}
    </div>
  );

}

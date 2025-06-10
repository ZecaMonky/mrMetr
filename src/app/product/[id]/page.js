"use client";

import Image from "next/image";
import { use , useEffect, useState } from "react";
import { FaHeart, FaRegHeart, FaTrash } from "react-icons/fa";

async function getProduct(id) {
  const res = await fetch(`/api/products/${id}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.product;
}

export default function ProductPage({ params }) {
  const { id } = use(params);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    getProduct(id).then((data) => {
      setProduct(data);
      setLoading(false);
    });

    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setCartItems(storedCart);
    setFavorites(storedFavorites);
  }, [id]);

  const addToCart = () => {
    const newCart = [...cartItems, product];
    setCartItems(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const handleRemoveFromCart = () => {
  const updatedCart = cartItems.filter(item => item.id !== product.id);
  setCartItems(updatedCart);
  localStorage.setItem("cart", JSON.stringify(updatedCart));
};

  const toggleFavorite = () => {
    const isFav = favorites.some((item) => item.id === product.id);
    const newFavorites = isFav
      ? favorites.filter((item) => item.id !== product.id)
      : [...favorites, product];

    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  const isInCart = cartItems.some((item) => item.id === product?.id);
  const isFavorite = favorites.some((item) => item.id === product?.id);

  if (loading || !product) return <div className="p-4">Загрузка...</div>;

  return (
    <div className="container mx-auto px-4 sm:px-0 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_320px] gap-8 items-start">
        <div className="relative aspect-square overflow-hidden shadow-sm">
          <Image
            src={product.image || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
          <button
            onClick={toggleFavorite}
            className="absolute top-2 right-2 bg-white/50 p-1.5 rounded-xs  shadow-md"
          >
            {isFavorite ? (
              <FaHeart className="text-pink-600" size={18} />
            ) : (
              <FaRegHeart className="text-gray-600 hover:text-pink-600" size={18} />
            )}
          </button>
        </div>

        <div className="flex flex-col">
          <h1 className="text-lg sm:text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-700 whitespace-pre-line">
            {product.description || "Описание временно отсутствует."}
          </p>
        </div>

        <div className="border border-gray-200 rounded-xl shadow-md p-6 space-y-4 hidden lg:block">
          <div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl text-red-700 font-bold">{product.price} ₽</p>
              <p className="text-sm text-gray-500 line-through">
                {Math.round(product.price * 1.2)} ₽
              </p>
            </div>
            {product.sku && (
              <p className="text-sm text-gray-500">Артикул: {product.sku}</p>
            )}
          </div>
          {isInCart ? (
            <div className="flex gap-2">
              <button
                disabled
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xs font-semibold bg-green-600 text-white cursor-default"
              >
                В корзине
              </button>
              <button
                onClick={handleRemoveFromCart}
                className="flex items-center justify-center w-6 rounded-xs font-semibold text-gray-400 hover:text-red-600 transition"
                aria-label="Удалить из корзины"
              >
                <FaTrash size={20} />
              </button>
            </div>
          ) : (
            <button
              onClick={addToCart}
              className="w-full py-3 rounded-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition"
            >
              Добавить в корзину
            </button>
          )}
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white p-4 border-t z-50">
        <div className="pb-2">
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-red-700">{product.price} ₽</p>
              <p className="text-sm text-gray-500 line-through">
                {Math.round(product.price * 1.2)} ₽
              </p>
            </div>
            {product.sku && (
              <p className="text-sm text-gray-500">Артикул: {product.sku}</p>
            )}
          </div>
          {isInCart ? (
            <div className="flex gap-2">
              <button
                disabled
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xs font-semibold bg-green-600 text-white cursor-default"
              >
                В корзине
              </button>
              <button
                onClick={handleRemoveFromCart}
                className="flex items-center justify-center w-6 rounded-xs font-semibold text-gray-400 hover:text-red-600 transition"
                aria-label="Удалить из корзины"
              >
                <FaTrash size={20} />
              </button>
            </div>
          ) : (
            <button
              onClick={addToCart}
              className="w-full py-3 rounded-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition"
            >
              Добавить в корзину
            </button>
          )}
      </div>
    </div>
  );
}

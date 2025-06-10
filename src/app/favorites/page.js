"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

import Product from "../components/product";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("cart")) || [];
    }
    return [];
  });

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  const removeFromFavorites = (product) => {
    const updated = favorites.filter((item) => item.id !== product.id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      if (prevCart.some((item) => item.id === product.id)) return prevCart;
      return [...prevCart, product];
    });
  };

    const removeFromCart = (productId) => {
      setCart((prevCart) => {
        return prevCart.filter((item) => item.id !== productId);
      });
    };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <div className="container mx-auto w-full mt-5 px-4 sm:px-0 sm:mt-10">
      <h1 className="text-2xl font-bold mb-4">Избранное</h1>
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {favorites.map((product) => (
            <Product
              key={product.id}
              product={product}
              mode="favorites"
              isFavorite={true}
              removeFromFavorites={removeFromFavorites}
              removeFromCart={removeFromCart}
              addToCart={addToCart}
              isInCart={cart.some((item) => item.id === product.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-0 sm:py-10">
          <img
            src="/favorite-background.png"
            alt="Избранное пусто"
            className="w-128 h-128 object-contain mb-2 sm:mb-6"
          />
          <p className="text-xl font-semibold mb-2">В избранном нет товаров</p>
          <p className="text-gray-500">Сохраняйте товары, которые понравились</p>
        </div>
      )}
    </div>
  );
}

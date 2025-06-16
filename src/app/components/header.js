"use client";

import { motion, AnimatePresence } from "framer-motion";
import { debounce } from "lodash";
import Image from "next/image";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [timeoutId, setTimeoutId] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/me', {
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const debouncedSearch = debounce((query) => {
      onSearch(query);
    }, 500);

    debouncedSearch(searchQuery);

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Ошибка при загрузке категорий:", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const router = useRouter();

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const handleCatalogClick = () => {
    router.push("/catalog");
  };

  const handleCategoryClick = (categoryId, subcategoryId = null) => {
    const query = new URLSearchParams();
    query.set("categoryId", categoryId);
    if (subcategoryId) query.set("subcategoryId", subcategoryId);
    router.push(`/catalog?${query.toString()}`);
  };

  const onSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      const filtered = data.products.filter((product) =>
        [product.name, product.description, product.sku]
          .some(field => field?.toLowerCase().includes(query.toLowerCase()))
      );
      setSearchResults(filtered.slice(0, 5));
    } catch (err) {
      console.error("Ошибка при поиске:", err);
    }
  };

  const handleSelectResult = (name) => {
    setSearchQuery(name);
    setSearchResults([]);
    router.push(`/catalog?search=${encodeURIComponent(name)}`);
  };

  const handleMouseEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setIsOpen(false);
    }, 500);
    setTimeoutId(id);
  };

  return (
    <header className="container mx-auto w-full bg-white py-6 px-4 sm:px-0 border-b-1 border-gray-300">
      <div className="hidden lg:flex justify-between items-center pb-2">
        <div className="flex space-x-4 text-xs text-neutral-600">
          <Link href="/support" className="hover:text-gray-500">Поддержка</Link>
          <Link href="/contacts" className="hover:text-gray-500">Контакты</Link>
        </div>
        <div className="flex space-x-10 text-xs text-neutral-600">
          <div>пн - вс с 9:00 до 21:00</div>
          <Link href="tel:+73532430220">+7 (3532) 43‒02‒20</Link>
        </div>
      </div>

      <div className="flex justify-between items-center gap-4 flex-wrap relative">
      <div className="flex items-center">
        <Link href="/">
          <Image src="/logo.png" alt="Логотип" width={130} height={35} />
        </Link>
      </div>

        <div className="lg:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded-lg text-white">
            Меню
          </button>
        </div>

        {isOpen && (
          <div className="absolute top-32 left-0 w-full bg-white shadow-md z-20 pt-2 flex flex-col lg:hidden">
            <Link 
              href="/catalog" 
              onClick={() => setIsOpen(false)}
              className="py-2 px-4 text-gray-700 hover:bg-gray-100"
            >
              Каталог
            </Link>
            <Link 
              href="/favorites" 
              onClick={() => setIsOpen(false)}
              className="py-2 px-4 text-gray-700 hover:bg-gray-100"
            >
              Избранное
            </Link>
            <Link 
              href="/cart" 
              onClick={() => setIsOpen(false)}
              className="py-2 px-4 text-gray-700 hover:bg-gray-100"
            >
              Корзина
            </Link>
            <Link 
              href="/support" 
              onClick={() => setIsOpen(false)}
              className="py-2 px-4 text-gray-700 hover:bg-gray-100"
            >
              Поддержка
            </Link>
            <Link 
              href="/contacts" 
              onClick={() => setIsOpen(false)}
              className="py-2 px-4 text-gray-700 hover:bg-gray-100"
            >
              Контакты
            </Link>

            {loadingUser ? null : user ? (
              <>
                <Link 
                  href="/profile" 
                  onClick={() => setIsOpen(false)}
                  className="py-2 px-4 text-gray-700 hover:bg-gray-100"
                >
                  Профиль
                </Link>
                <button
                  onClick={async () => {
                    await fetch('/api/logout', { method: 'POST', credentials: 'include' });
                    setUser(null);
                    setIsOpen(false);
                    router.push('/');
                  }}
                  className="py-2 px-4 text-left text-gray-700 hover:bg-gray-100 w-full"
                >
                  Выход
                </button>
              </>
            ) : (
              <Link 
                href="/login" 
                onClick={() => setIsOpen(false)}
                className="py-2 px-4 text-gray-700 hover:bg-gray-100"
              >
                Вход
              </Link>
            )}
            <span className="py-2 px-4 text-gray-700">пн - вс с 9:00 до 21:00</span>
            <Link 
              className="py-2 px-4 text-gray-700" 
              href="tel:+73532430220"
              onClick={() => setIsOpen(false)}
            >
              +7 (3532) 43‒02‒20
            </Link>
          </div>
        )}

        <div className="relative hidden lg:block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <button onClick={handleCatalogClick} className="flex items-center gap-2 px-5 py-2 bg-sky-600 hover:bg-sky-700 rounded-lg text-white">
            Каталог
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="absolute w-52 bg-white rounded-lg shadow-lg z-12"
              >
                {categories.map((category, index) => (
                  <div
                    key={category.id}
                    onMouseEnter={() => setOpenCategory(index)}
                    onMouseLeave={() => setOpenCategory(null)}
                  >
                    <button
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      {category.name}
                    </button>

                    <AnimatePresence>
                      {openCategory === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {category.subcategories.map((sub) => (
                            <div
                              key={sub.id}
                              className="px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                              onClick={() => handleCategoryClick(category.id, sub.id)}
                            >
                              {sub.name}
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-grow max-w-5xl text-black relative">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
          </svg>
          <input
            type="text"
            placeholder="Поиск..."
            className="w-full pl-10 pr-4 py-2 border-2 border-blue-400 rounded-lg focus:outline-none focus:border-blue-500 placeholder-gray-700"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {searchResults.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded-lg shadow-md max-h-60 overflow-auto">
              {searchResults.map((product) => (
                <li
                  key={product.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectResult(product.name)}
                >
                  {product.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="hidden lg:flex space-x-4">
          {loadingUser ? (
            <div className="w-14 flex justify-center items-center">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
            </div>
            ) : user ? (
              <button
                onClick={() => router.push('/profile')}
                className="flex flex-col items-center w-14 text-gray-700 hover:text-gray-500"
              >
                <Image src="/avatar.png" alt="avatar" width={18} height={18} />
                <span className="text-xs mt-1">Профиль</span>
              </button>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="flex flex-col items-center w-14 text-gray-700 hover:text-gray-500"
              >
                <Image src="/avatar.png" alt="avatar" width={18} height={18} />
                <span className="text-xs mt-1">Вход</span>
              </button>
            )}
          <button
            onClick={() => router.push("/favorites")}
            className="flex flex-col items-center w-14 text-gray-700 hover:text-gray-500"
          >
            <Image src="/favorite.png" alt="favorite" width={18} height={18} />
            <span className="text-xs mt-1">Избранное</span>
          </button>
          <button
            onClick={() => router.push("/cart")}
            className="flex flex-col items-center w-14 text-gray-700 hover:text-gray-500 justify-center"
          >
            <Image src="/cart.png" alt="cart" width={18} height={18} />
            <span className="text-xs mt-1">Корзина</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import CategoryCard from './categoryCard';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error('Ошибка при загрузке категорий:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const router = useRouter();

  const handleCategoryClick = (categoryId, subcategoryId = null) => {
    const query = new URLSearchParams();
    query.set('categoryId', categoryId);
    if (subcategoryId) query.set('subcategoryId', subcategoryId);
    router.push(`/catalog?${query.toString()}`);
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="category-slider-container px-4 sm:px-0">
      <Swiper
        spaceBetween={30}
        slidesPerView="auto"
        pagination={{ clickable: true }}
        modules={[Autoplay, Pagination]}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: { slidesPerView: 1.5 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
        }}
      >
        {categories.map((category) => (
          <SwiperSlide key={category.id}>
            <CategoryCard
              title={category.name}
              titleLink={`/catalog?categoryId=${category.id}`}
              imageSrc={`/categories/${category.image}.png`}
              subcategories={category.subcategories.map((sub) => ({
                name: sub.name,
                link: `/catalog?categoryId=${category.id}&subcategoryId=${sub.id}`,
              }))}
              onClick={() => handleCategoryClick(category.id)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CategoryList;

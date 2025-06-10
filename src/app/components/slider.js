'use client';

import Image from 'next/image';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const banners = [
  { id: 1, src: '/banner1.png', alt: 'Баннер 1' },
  { id: 2, src: '/banner2.png', alt: 'Баннер 2' },
  { id: 3, src: '/banner1.png', alt: 'Баннер 3' },
];

export default function BannerSlider() {
  return (
    <div className="container mx-auto w-full mt-5 px-4 sm:px-0 sm:mt-10">
      <div className="w-full">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop
          pagination={{ clickable: true }}
          navigation
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 1.2,
            },
            768: {
              slidesPerView: 1.3,
            },
            1024: {
              slidesPerView: 1.5,
            },
          }}
          className="custom-swiper"
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <div className="w-full h-[170px] sm:h-[250px] lg:h-[500px] relative rounded-md sm:rounded-xl border border-gray-200 overflow-hidden">
                <Image
                  src={banner.src}
                  alt={banner.alt}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

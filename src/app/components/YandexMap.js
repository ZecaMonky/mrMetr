'use client';

import { useEffect } from 'react';

export default function YandexMap() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1/?apikey=c190725d-c99e-4558-a31d-04f8fd6726cc&lang=ru_RU';
    script.type = 'text/javascript';
    script.onload = () => {
      window.ymaps.ready(() => {
        const center = [51.82523324228423, 55.13701446166976];

        const map = new window.ymaps.Map('map', {
          center,
          zoom: 12,
        });

        const placemark = new window.ymaps.Placemark(center, {
          hintContent: 'Метр',
          balloonContent: 'Оренбург, ул. Берёзка, 2/4',
        }, {
          preset: 'islands#redShoppingIcon',
          draggable: false,
        });

        map.geoObjects.add(placemark);
      });
    };
    document.head.appendChild(script);
  }, []);

  return <div id="map" style={{ width: '100%', height: '400px' }} />;
}

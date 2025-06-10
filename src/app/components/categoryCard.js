'use client';

import Image from 'next/image';
import Link from 'next/link';

const CategoryCard = ({
  title,
  titleLink,
  subcategories = [],
  imageSrc,
}) => {
  return (
    <div className="w-full sm:w-full h-36 sm:h-74 sm:max-w-xs md:max-w-md lg:max-w-lg bg-zinc-100 rounded relative overflow-hidden p-4 flex flex-col justify-between shadow">
      <div>
        <h2 className="text-lg sm:text-md md:text-md font-bold text-black mb-2">
          <Link href={titleLink} className="hover:underline">
            {title}
          </Link>
        </h2>
        <ul className="space-y-1 text-xs sm:text-base font-medium text-zinc-800">
          {subcategories.map(({ name, link }) => (
            <li key={name}>
              <Link href={link} className="hover:underline">
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="absolute bottom-0 right-0 w-32 h-28 sm:w-48 sm:h-40">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-contain z-12"
        />
      </div>
    </div>
  );
};

export default CategoryCard;

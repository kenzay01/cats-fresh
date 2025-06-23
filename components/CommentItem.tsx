import Image, { StaticImageData } from "next/image";
import { FaStar } from "react-icons/fa6";

export default function CommentItem({
  name,
  text,
  rating,
  image,
}: {
  name: string;
  text: string;
  rating: number;
  image: StaticImageData;
}) {
  const ratingStars = Array.from({ length: 5 }, (_, index) =>
    index < rating ? (
      <FaStar key={index} className="text-[var(--color-burnt-orange)] inline" />
    ) : (
      <FaStar key={index} className="text-[var(--color-cream)] inline" />
    )
  );

  return (
    <div className="bg-[var(--color-lime-green)] rounded-2xl shadow-lg border border-gray-100 h-full hover:shadow-xl duration-300 overflow-hidden hover:translate-y-[-8px] transition-all">
      {/* Image container */}
      {/* <div className="relative h-48 lg:h-56 w-full">
        <Image
          src={image}
          alt={`Домашній улюбленець ${name}`}
          fill
          className="object-cover"
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div> */}

      {/* Content container */}
      <div className="p-4 lg:p-6 flex flex-col gap-3 lg:gap-4">
        {/* Name and rating */}
        <div className="flex items-center justify-between flex-col xl:flex-row">
          <div className="flex items-center gap-3">
            <div className="relative h-16 w-16 rounded-full overflow-hidden">
              <Image
                src={image}
                alt={`Домашній улюбленець ${name}`}
                fill
                className="object-cover"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <h3 className="text-lg font-semibold text-[var(--color-forest-green)] truncate">
              {name}
            </h3>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
            <div className="flex">{ratingStars}</div>
            <span className="ml-1 text-xs lg:text-sm text-[var(--color-forest-green)] font-medium">
              {rating}/5
            </span>
          </div>
        </div>
        <hr className="border-1 border-[var(--color-forest-green)]" />

        {/* Comment text */}
        <div className="flex-1">
          <p className="text-[var(--color-forest-green)] text-sm lg:text-base leading-relaxed">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

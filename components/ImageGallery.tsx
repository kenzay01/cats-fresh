import { useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

interface ImageGalleryProps {
  images: StaticImageData[];
  productName: string;
}

export default function ImageGallery({
  images,
  productName,
}: ImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isFullscreenOpen) {
        if (event.key === "Escape") {
          closeFullscreen();
        } else if (event.key === "ArrowLeft") {
          prevFullscreenImage();
        } else if (event.key === "ArrowRight") {
          nextFullscreenImage();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreenOpen]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextFullscreenImage = () => {
    setFullscreenImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevFullscreenImage = () => {
    setFullscreenImageIndex(
      (prev) => (prev - 1 + images.length) % images.length
    );
  };

  const openFullscreen = () => {
    setFullscreenImageIndex(currentImageIndex);
    setIsFullscreenOpen(true);
    // Блокуємо прокрутку сторінки
    document.body.style.overflow = "hidden";
  };

  const closeFullscreen = () => {
    setIsFullscreenOpen(false);
    document.body.style.overflow = "unset";
  };

  if (images.length === 0) {
    return (
      <div className="relative w-full h-full bg-gradient-to-br from-[var(--color-lime-green)]/10 to-[var(--color-burnt-orange)]/10 flex items-center justify-center">
        <span className="text-gray-500">Зображення не знайдено</span>
      </div>
    );
  }

  return (
    <>
      {/* Main Gallery - Now takes full height and width of its container */}
      <div className="relative w-full h-full min-h-[300px] bg-gradient-to-br from-[var(--color-lime-green)]/10 to-[var(--color-burnt-orange)]/10">
        <Image
          src={images[currentImageIndex]}
          alt={`${productName} - фото ${currentImageIndex + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover cursor-pointer"
          priority
          onClick={openFullscreen}
          quality={30}
          placeholder="blur"
          blurDataURL={images[currentImageIndex].blurDataURL}
        />

        {/* Zoom Icon */}
        <button
          onClick={openFullscreen}
          className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
          aria-label="Відкрити на повний екран"
        >
          <ZoomIn size={20} />
        </button>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
              aria-label="Попереднє фото"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
              aria-label="Наступне фото"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-10">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentImageIndex
                    ? "bg-white"
                    : "bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Перейти до фото ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreenOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={closeFullscreen}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <button
            onClick={closeFullscreen}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full transition-colors z-10"
            aria-label="Закрити"
          >
            <X size={32} />
          </button>

          <div
            className="relative w-full h-full flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[fullscreenImageIndex]}
              alt={`${productName} - фото ${fullscreenImageIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              quality={30}
              loading="lazy"
              placeholder="blur"
              blurDataURL={images[fullscreenImageIndex].blurDataURL}
            />

            {/* Fullscreen Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevFullscreenImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
                  aria-label="Попереднє фото"
                >
                  <ChevronLeft size={32} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextFullscreenImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
                  aria-label="Наступне фото"
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}

            {/* Fullscreen Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
                {fullscreenImageIndex + 1} / {images.length}
              </div>
            )}

            {/* Fullscreen Thumbnails */}
            {images.length > 1 && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFullscreenImageIndex(index);
                    }}
                    className={`w-4 h-4 rounded-full transition-colors ${
                      index === fullscreenImageIndex
                        ? "bg-white"
                        : "bg-white/50 hover:bg-white/70"
                    }`}
                    aria-label={`Перейти до фото ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

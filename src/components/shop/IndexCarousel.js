"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const IndexCarousel = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const totalSlides = slides.length;

  // Auto-slide every 3.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        goToNext();
      }
    }, 3500);
    return () => clearInterval(interval);
  }, [isTransitioning]);

  const goToNext = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const goToPrev = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleTransitionEnd = () => {
    setIsTransitioning(false);

    // Handle infinite loop behavior
    if (currentIndex >= totalSlides) {
      setCurrentIndex(0); // Jump to the first slide (without transition)
    } else if (currentIndex < 0) {
      setCurrentIndex(totalSlides - 1); // Jump to the last slide (without transition)
    }
  };

  return (
    <div className="relative mt-2 w-full overflow-hidden">
      {/* Slides */}
      <div
        className={`flex ${
          isTransitioning ? "transition-transform duration-700" : ""
        }`}
        style={{
          transform: `translateX(-${(currentIndex + 1) * 100}%)`,
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {/* Clone last slide at the beginning */}
        <div className="relative w-full min-w-full h-[50vh] md:h-[60vh]">
          <Image
            src={slides[totalSlides - 1].src}
            alt={slides[totalSlides - 1].caption}
            fill
            className="object-cover"
          />
          <div className="absolute bottom-10 bg-black bg-opacity-50 text-white w-full text-center py-2 sm:py-4">
            <h3 className="text-sm sm:text-lg font-semibold">
              {slides[totalSlides - 1].caption}
            </h3>
          </div>
        </div>

        {/* Main slides */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className="relative w-full min-w-full h-[50vh] md:h-[60vh]"
          >
            <Image
              src={slide.src}
              alt={slide.caption}
              fill
              className="object-cover"
            />
            <div className="absolute bottom-10 bg-black bg-opacity-50 text-white w-full text-center py-2 sm:py-4">
              <h3 className="text-sm sm:text-lg font-semibold">
                {slide.caption}
              </h3>
            </div>
          </div>
        ))}

        {/* Clone first slide at the end */}
        <div className="relative w-full min-w-full h-[50vh] md:h-[60vh]">
          <Image
            src={slides[0].src}
            alt={slides[0].caption}
            fill
            className="object-cover"
          />
          <div className="absolute bottom-10 bg-black bg-opacity-50 text-white w-full text-center py-2 sm:py-4">
            <h3 className="text-sm sm:text-lg font-semibold">
              {slides[0].caption}
            </h3>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-5 w-full flex justify-center space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isTransitioning) {
                setCurrentIndex(index);
                setIsTransitioning(true);
              }
            }}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? "bg-green-500" : "bg-gray-400"
            }`}
          />
        ))}
      </div>

      {/* Manual Navigation */}
      <button
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
        onClick={goToPrev}
        disabled={isTransitioning}
      >
        Prev
      </button>
      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
        onClick={goToNext}
        disabled={isTransitioning}
      >
        Next
      </button>
    </div>
  );
};

export default IndexCarousel;

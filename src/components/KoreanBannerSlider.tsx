"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSidebar } from './CategorySidebar';
import { useCMS } from './CMSContext';

const KoreanBannerSlider = () => {
  const { isOpen, isRightSidebarOpen } = useSidebar(); // Get sidebar state
  const { cmsData } = useCMS(); // Get CMS data
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Get banner data from CMS
  const banners = cmsData.bannerSlider;

  // Auto-rotate slides
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoplay) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }, 5000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoplay, banners.length]);

  // Pause autoplay when hovering
  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <section className={`py-8 bg-gray-100 ${isOpen ? 'md:ml-[310px]' : ''} ${isRightSidebarOpen ? 'lg:mr-[290px]' : ''} transition-all duration-300`}>
      <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-7xl">
        <div 
          ref={sliderRef}
          className="relative overflow-hidden rounded-lg shadow-lg"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Slides */}
          <div className="relative h-[300px] md:h-[400px]">
            {banners.map((banner, index) => (
              <motion.div
                key={banner.id}
                className={`absolute inset-0 ${banner.bgColor} transition-opacity duration-500 ${
                  currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: currentSlide === index ? 1 : 0,
                  x: currentSlide === index ? 0 : (currentSlide > index ? -100 : 100)
                }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                  {/* Text content - Korean style with bold typography */}
                  <div className="flex flex-col justify-center p-8 md:p-12 text-white">
                    <h2 className="text-3xl md:text-5xl font-black mb-3 tracking-tight">
                      {banner.title}
                    </h2>
                    <h3 className="text-xl md:text-2xl font-bold mb-4">
                      {banner.subtitle}
                    </h3>
                    <p className="text-lg mb-6 opacity-90">
                      {banner.description}
                    </p>
                    <div>
                      <Link 
                        href={banner.link}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-colors"
                      >
                        {banner.buttonText}
                      </Link>
                    </div>
                  </div>
                  
                  {/* Image */}
                  <div className="relative hidden md:block">
                    <Image
                      src={banner.image}
                      alt={banner.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      priority={index === 0}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Navigation arrows */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* Slide indicators - Korean style with numbered dots */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
                  currentSlide === index 
                    ? 'bg-white text-black font-bold' 
                    : 'bg-white/30 text-white hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default KoreanBannerSlider; 
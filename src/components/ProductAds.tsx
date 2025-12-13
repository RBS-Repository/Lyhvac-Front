"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from './CategorySidebar';
import { useCMS } from './CMSContext';

const ProductAds = () => {
  const { isOpen, isRightSidebarOpen } = useSidebar();
  const { cmsData } = useCMS(); // Get CMS data
  const [currentAd, setCurrentAd] = useState(0);

  // Get data from CMS
  const { ads, specialPromotions } = cmsData.productAds;

  // Auto-rotate ads
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % ads.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [ads.length]);

  return (
    <section className={`py-16 bg-gray-50 ${isOpen ? 'md:ml-[310px]' : ''} ${isRightSidebarOpen ? 'lg:mr-[290px]' : ''} transition-all duration-300`}>
      <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-7xl">
        {/* Main featured highlights carousel */}
        <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg mb-16">
          <AnimatePresence mode="wait">
            {ads.map((ad, index) => (
              currentAd === index && (
                <motion.div
                  key={ad.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px]">
                    {/* Text content */}
                    <div className={`p-8 md:p-12 flex flex-col justify-center ${ad.position === 'right' ? 'lg:order-1' : 'lg:order-2'}`}>
                      <div className="max-w-md">
                        <h3 className="text-sm font-medium text-blue-600 mb-3">Featured Highlight</h3>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">{ad.title}</h2>
                        <h4 className="text-xl md:text-2xl text-gray-700 mb-4">{ad.subtitle}</h4>
                        <p className="text-gray-600 mb-8">{ad.description}</p>
                        <Link 
                          href={ad.link}
                          className={`inline-block bg-gradient-to-r ${ad.color} text-white px-8 py-3 rounded-md font-medium hover:shadow-md transition-all`}
                        >
                          {ad.cta}
                        </Link>
                      </div>
                    </div>
                    
                    {/* Image */}
                    <div className={`relative ${ad.position === 'right' ? 'lg:order-2' : 'lg:order-1'}`}>
                      <div className="aspect-[4/3] relative w-full h-full">
                        <Image
                          src={ad.image}
                          alt={ad.title}
                          fill
                          style={{ objectFit: 'cover' }}
                          className="w-full h-full"
                        />
                      </div>
                      
                      {/* Decorative element */}
                      <div className={`absolute top-0 ${ad.position === 'right' ? 'left-0' : 'right-0'} w-1/3 h-1 bg-gradient-to-r ${ad.color}`}></div>
                    </div>
                  </div>
                </motion.div>
              )
            ))}
          </AnimatePresence>
          
          {/* Carousel indicators */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            {ads.map((_, index) => (
              <button 
                key={index}
                onClick={() => setCurrentAd(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentAd === index 
                    ? 'bg-blue-600 w-6' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Highlights */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 flex items-center">
            <span className="block w-8 h-1 bg-blue-600 mr-4"></span>
            Highlights
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {specialPromotions.map((promo) => (
              <Link 
                key={promo.id}
                href={promo.link}
                className="group relative overflow-hidden rounded-lg shadow-md"
              >
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image
                    src={promo.image}
                    alt={promo.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 md:p-8">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{promo.title}</h3>
                    <p className="text-gray-200 mb-4">{promo.description}</p>
                    <div className="flex items-center text-white font-medium">
                      <span>Learn More</span>
                      <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </div>
                {/* Korean-inspired accent */}
                <div className="absolute top-0 left-0 w-1/4 h-1 bg-blue-600"></div>
                <div className="absolute bottom-0 right-0 w-1/4 h-1 bg-blue-600"></div>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Informational banner (showcase-only) */}
        <div className="mb-16 overflow-hidden rounded-lg relative">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 py-8 md:py-0">
            <div className="grid grid-cols-1 md:grid-cols-5">
              <div className="md:col-span-3 p-8 md:p-12 flex flex-col justify-center">
                <div className="max-w-xl">
                  <h3 className="text-sm font-medium text-blue-300 mb-3 uppercase tracking-wider">Why It Matters</h3>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Quiet, Efficient, Built to Last</h2>
                  <p className="text-blue-100 mb-6 text-lg">
                    Learn what sets modern HVAC systems apart: efficiency ratings, sound levels, and install quality.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link 
                      href="/products/premium"
                      className="inline-block bg-white text-blue-900 px-8 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors"
                    >
                      Explore Premium Models
                    </Link>
                    <Link 
                      href="/consultation"
                      className="inline-block border border-white text-white px-8 py-3 rounded-md font-medium hover:bg-white/10 transition-colors"
                    >
                      Talk to an Expert
                    </Link>
                  </div>
                </div>
              </div>
              <div className="md:col-span-2 relative">
                <div className="relative h-full min-h-[250px]">
                  <Image
                    src="https://images.unsplash.com/photo-1581275060503-1df1138a0d80?q=80&w=2070"
                    alt="Premium HVAC System"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500"></div>
        </div>
        
        {/* Call to action banner with Korean-inspired design */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="md:col-span-2 p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Need help choosing the right system?</h2>
              <p className="text-gray-300 mb-8 max-w-xl">
                Our HVAC experts can help you find the perfect solution for your home or business. Schedule a free consultation today.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/contact"
                  className="inline-block bg-white text-gray-900 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
                >
                  Contact Us
                </Link>
                <Link 
                  href="/services/consultation"
                  className="inline-block bg-transparent border border-white text-white px-8 py-3 rounded-md font-medium hover:bg-white/10 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="hidden md:block relative">
              {/* Korean-inspired decorative element */}
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
              <div className="absolute bottom-0 right-0 w-1/2 h-1 bg-blue-600"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductAds; 
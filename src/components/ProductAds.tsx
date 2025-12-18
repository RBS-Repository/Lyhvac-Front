"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from './CategorySidebar';
import { useCMS } from './CMSContext';

const ProductAds = () => {
  const { isOpen, isRightSidebarOpen } = useSidebar();
  const { cmsData } = useCMS();
  const [currentAd, setCurrentAd] = useState(0);

  const { ads, specialPromotions } = cmsData.productAds;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % ads.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [ads.length]);

  return (
    <section className={`py-20 bg-white transition-all duration-500 ease-in-out ${isOpen ? 'md:ml-[310px]' : ''} ${isRightSidebarOpen ? 'lg:mr-[290px]' : ''}`}>
      <div className="container mx-auto px-6 max-w-7xl">

        {/* --- 1. Main Hero Carousel (Redesigned with Depth) --- */}
        <div className="relative mb-24 min-h-[500px] flex items-center">
          <AnimatePresence mode="wait">
            {ads.map((ad, index) => (
              currentAd === index && (
                <motion.div
                  key={ad.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.6, ease: "circOut" }}
                  className="grid grid-cols-1 lg:grid-cols-12 w-full gap-8 items-center"
                >
                  {/* Image Block with Decorative Background */}
                  <div className={`lg:col-span-7 relative group ${ad.position === 'right' ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div className={`absolute -inset-4 bg-gradient-to-tr ${ad.color} opacity-10 rounded-[3rem] blur-2xl group-hover:opacity-20 transition-opacity`} />
                    <div className="relative aspect-[16/9] rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-2xl">
                      <Image
                        src={ad.image}
                        alt={ad.title}
                        fill
                        className="object-cover transform group-hover:scale-105 transition-transform duration-[2s]"
                      />
                    </div>
                  </div>

                  {/* Text Block */}
                  <div className={`lg:col-span-5 flex flex-col justify-center ${ad.position === 'right' ? 'lg:order-1' : 'lg:order-2'}`}>
                    <motion.span
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                      className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-4"
                    >
                      Featured Highlight
                    </motion.span>
                    <motion.h2
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                      className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-4"
                    >
                      {ad.title}
                    </motion.h2>
                    <h4 className="text-xl text-gray-500 font-medium mb-6">{ad.subtitle}</h4>
                    <p className="text-gray-600 text-lg leading-relaxed mb-8">{ad.description}</p>

                    <Link href={ad.link} className="w-fit">
                      <motion.div
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        className={`px-10 py-4 rounded-full bg-gradient-to-r ${ad.color} text-white font-bold shadow-lg shadow-blue-500/20`}
                      >
                        {ad.cta}
                      </motion.div>
                    </Link>
                  </div>
                </motion.div>
              )
            ))}
          </AnimatePresence>

          {/* Minimalist Indicators */}
          <div className="absolute -bottom-10 left-0 flex gap-3">
            {ads.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentAd(index)}
                className={`h-1.5 transition-all duration-500 rounded-full ${currentAd === index ? 'w-12 bg-blue-600' : 'w-4 bg-gray-200'}`}
              />
            ))}
          </div>
        </div>

        {/* --- 2. Highlights (Modern Cards) --- */}
        <div className="mb-24">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-3xl font-black tracking-tight">SPECIAL OFFERS</h2>
            <div className="h-px flex-1 bg-gray-100" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {specialPromotions.map((promo, i) => (
              <Link key={promo.id} href={promo.link} className="group relative">
                <div className="relative h-[350px] rounded-[2rem] overflow-hidden shadow-xl border border-gray-100">
                  <Image
                    src={promo.image}
                    alt={promo.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Glass Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent" />

                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <h3 className="text-2xl font-bold text-white mb-2">{promo.title}</h3>
                    <p className="text-gray-300 text-sm mb-6 max-w-xs">{promo.description}</p>
                    <div className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
                      Discover Now <span className="text-xl">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>


      </div>
    </section>
  );
};

export default ProductAds;
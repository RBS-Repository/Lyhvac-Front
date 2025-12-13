"use client";

import Link from 'next/link';
import Image from 'next/image';

import { useSidebar } from './CategorySidebar';

const KoreanProductBanner = () => {
  const { isOpen, isRightSidebarOpen } = useSidebar(); // Get sidebar state
  
  
  // Banner data based on the Korean design in the image
  const banners = [
    {
      id: 1,
      title: "MK Pneumatic Valve",
      subtitle: "MK PNEUMATIC VALVE",
      description: "Find every valve you need here — including pneumatic valves.",
      image: "https://placehold.co/1200x400/333333/FFFFFF/png?text=MK+Pneumatic+Valve",
      bgImage: "https://placehold.co/1200x400/222222/FFFFFF/png?text=Dark+Background",
      link: "/products/valves",
      buttonText: "MORE"
    },
    {
      id: 2,
      title: "Premium Brand",
      subtitle: "PREMIUM BRAND",
      description: "Experience MK — the signature brand with our best-selling products.",
      image: "https://placehold.co/1200x400/222222/FFCC00/png?text=Premium+Brand+MK",
      bgImage: "https://placehold.co/1200x400/111111/FFFFFF/png?text=Dark+Background",
      link: "/products/premium",
      buttonText: "Learn More"
    }
  ];

  return (
    <section className={`py-8 bg-gray-100 ${isOpen ? 'md:ml-[310px]' : ''} ${isRightSidebarOpen ? 'lg:mr-[290px]' : ''} transition-all duration-300`}>
      <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Banner - Korean-style valve banner */}
          <div className="relative overflow-hidden rounded-lg bg-gray-900 h-[300px]">
            <div className="absolute inset-0 opacity-70">
              <Image
                src={banners[0].bgImage}
                alt="Background"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            
            <div className="relative h-full p-6 flex flex-col">
              {/* Korean text with bold typography */}
              <div className="flex-1 flex flex-col justify-center text-white">
                <h2 className="text-4xl font-black mb-1">{banners[0].title}</h2>
                <p className="text-sm font-bold mb-4 text-red-500">{banners[0].subtitle}</p>
                <p className="text-lg mb-6">{banners[0].description}</p>
              </div>
              
              {/* Product images in a row */}
              <div className="flex justify-end">
                <div className="relative w-3/4 h-32">
                  <Image
                    src={banners[0].image}
                    alt={banners[0].title}
                    fill
                    style={{ objectFit: 'contain', objectPosition: 'right' }}
                  />
                </div>
              </div>
              
              {/* "MORE" button in circle */}
              <Link 
                href={banners[0].link}
                className="absolute bottom-6 left-6 w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm hover:bg-red-700 transition-colors"
              >
                {banners[0].buttonText}
              </Link>
            </div>
          </div>
          
          {/* Second Banner - Premium brand banner */}
          <div className="relative overflow-hidden rounded-lg bg-gray-900 h-[300px]">
            <div className="absolute inset-0 opacity-70">
              <Image
                src={banners[1].bgImage}
                alt="Background"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            
            <div className="relative h-full p-6 flex flex-col">
              {/* Premium brand section */}
              <div className="bg-black/50 inline-block px-4 py-1 mb-4 self-start">
                <p className="text-sm font-bold text-white">PREMIUM BRAND</p>
              </div>
              
              {/* Large MK logo */}
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-7xl font-black text-white">
                    <span>M</span>
                    <span className="text-yellow-400">K</span>
                  </h2>
                </div>
              </div>
              
              {/* Description text */}
              <p className="text-white text-sm mb-4 max-w-xs">
                명인코리아의 시그니처 브랜드 MK가 선사하는 베스트셀러 제품을 경험해 보세요
              </p>
            </div>
          </div>
        </div>
        
        {/* Service Zone Banner - Full width */}
        <div className="mt-6 relative overflow-hidden rounded-lg bg-orange-500 h-[200px]">
          <div className="grid grid-cols-1 md:grid-cols-3 h-full">
            {/* Text content */}
            <div className="md:col-span-2 p-6 flex flex-col justify-center">
              <h2 className="text-4xl font-black text-white mb-2">
                체험 <span className="text-black">ZONE</span>
              </h2>
              <p className="text-xl font-bold text-white mb-2">새로운 서비스 신청</p>
              <p className="text-white mb-4">
                새롭게 선보이는 MK제품들의 미리 사용해보고 결정하세요!
              </p>
            </div>
            
            {/* Illustration */}
            <div className="hidden md:flex items-center justify-center relative">
              <div className="relative w-40 h-40">
                <Image
                  src="https://placehold.co/400x400/FFFFFF/FF9900/png?text=Service"
                  alt="Service Illustration"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              
              {/* Action button */}
              <Link 
                href="/services/trial"
                className="absolute bottom-6 right-6 bg-white text-orange-600 px-6 py-2 rounded font-bold text-sm hover:bg-gray-100 transition-colors"
              >
                신청하기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KoreanProductBanner; 

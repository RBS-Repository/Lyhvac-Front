"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useSidebar } from './CategorySidebar';

const testimonials = [
  {
    id: 1,
    text: "The installation team was professional and completed our new AC system in just one day. Their attention to detail and customer service exceeded our expectations.",
    author: "Sarah Johnson",
    role: "Homeowner",
    rating: 5,
    image: "https://placehold.co/400x400/e2e8f0/1e293b/png?text=SJ"
  },
  {
    id: 2,
    text: "We've been using their maintenance services for our office building for over 3 years. Always reliable and they've helped us reduce our energy costs significantly.",
    author: "Michael Chen",
    role: "Business Owner",
    rating: 5,
    image: "https://placehold.co/400x400/e2e8f0/1e293b/png?text=MC"
  },
  {
    id: 3,
    text: "Had an emergency heating issue during the coldest day of winter. They responded quickly and fixed the problem. Their team was courteous and knowledgeable.",
    author: "David Wilson",
    role: "Homeowner",
    rating: 5,
    image: "https://placehold.co/400x400/e2e8f0/1e293b/png?text=DW"
  },
  {
    id: 4,
    text: "The energy-efficient system they recommended has reduced our utility bills by 30%. Their expertise in selecting the right equipment was impressive.",
    author: "Jennifer Adams",
    role: "Property Manager",
    rating: 4,
    image: "https://placehold.co/400x400/e2e8f0/1e293b/png?text=JA"
  },
];

const Testimonials = () => {
  const { isOpen, isRightSidebarOpen } = useSidebar(); // Get sidebar state
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className={`py-16 bg-gray-50 ${isOpen ? 'md:ml-[310px]' : ''} ${isRightSidebarOpen ? 'lg:mr-[290px]' : ''} transition-all duration-300`}>
      <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-7xl">
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-gray-600">
            Read reviews from homeowners and businesses who trust our services
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white rounded-lg shadow-sm overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-8 md:p-12"
              >
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  <div className="flex-shrink-0">
                    <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-gray-100">
                      <Image 
                        src={testimonials[currentIndex].image} 
                        alt={testimonials[currentIndex].author}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <div className="mb-4 flex justify-center md:justify-start">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-5 h-5 ${i < testimonials[currentIndex].rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    
                    <blockquote>
                      <p className="text-lg text-gray-700 mb-6 italic">&quot;{testimonials[currentIndex].text}&quot;</p>
                      <footer>
                        <p className="font-semibold text-gray-900">{testimonials[currentIndex].author}</p>
                        <p className="text-gray-500 text-sm">{testimonials[currentIndex].role}</p>
                      </footer>
                    </blockquote>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Navigation controls */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between px-4">
              <button 
                onClick={prevTestimonial} 
                className="bg-white shadow-md text-gray-800 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100"
                aria-label="Previous testimonial"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button 
                onClick={nextTestimonial} 
                className="bg-white shadow-md text-gray-800 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100"
                aria-label="Next testimonial"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Pagination dots */}
          <div className="flex items-center justify-center space-x-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 
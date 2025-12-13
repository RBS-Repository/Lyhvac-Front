"use client";

import { useState, FC, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useSidebar } from './CategorySidebar';
import { useAuth } from './AuthContext';
import Header from './Header';

// --- TYPE DEFINITIONS ---
interface Product {
  _id: string;
  name: string;
  category: string;
  images: string[];
  price?: number;
  rating: number;
  badge: string | null;
  shortDescription: string;
  longDescription: string;
  specifications: { [key: string]: string };
  features: string[];
}

// Helper function to format PHP currency
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2
  }).format(price);
};

// Products will be fetched from API
const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    const res = await fetch(`http://localhost:5001/api/products/${id}`);
    if (!res.ok) return null;
    const data = await res.json();
    
    if (data.specifications instanceof Map) {
      data.specifications = Object.fromEntries(data.specifications);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

const fetchAllProducts = async (): Promise<Product[]> => {
  try {
    const res = await fetch('http://localhost:5001/api/products');
    if (!res.ok) return [];
    const data = await res.json();
    
    return data.map((product: any) => ({
      ...product,
      specifications: product.specifications instanceof Map 
        ? Object.fromEntries(product.specifications) 
        : product.specifications || {}
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// --- HELPER & UI COMPONENTS ---

const StarRating: FC<{ rating: number; className?: string }> = ({ rating, className }) => (
  <div className={`flex items-center ${className}`}>
    {[...Array(5)].map((_, i) => (
      <svg 
        key={i} 
        className={`w-5 h-5 ${i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const CheckIcon: FC = () => (
  <svg className="w-6 h-6 text-indigo-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

/**
 * Modern Image Gallery Component
 */
const ProductImageGallery: FC<{ images: string[]; productName: string }> = ({ images, productName }) => {
  const [mainImage, setMainImage] = useState(images[0]);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -50 }} 
      animate={{ opacity: 1, x: 0 }} 
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="lg:sticky lg:top-8"
    >
      {/* Main Image */}
      <div 
        className="relative bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl overflow-hidden border border-gray-100 group"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          setZoomPosition({ x, y });
          setShowZoom(true);
        }}
        onMouseLeave={() => setShowZoom(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={mainImage}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="relative aspect-square w-full bg-gray-50"
          >
            <Image 
              src={mainImage} 
              alt={productName} 
              fill 
              style={{ 
                objectFit: 'cover',
                transform: showZoom ? 'scale(1.5)' : 'scale(1)',
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
              }} 
              priority 
              className="transition-transform duration-700"
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Badge Overlay */}
        {images.indexOf(mainImage) === 0 && (
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
            <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-600 text-white rounded-full text-xs sm:text-sm font-bold shadow-lg">
              Featured
            </div>
          </div>
        )}
      </div>
      
      {/* Thumbnail Gallery */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-6">
        {images.map((img, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMainImage(img)}
            className={`relative aspect-square rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
              mainImage === img 
                ? 'border-indigo-500 shadow-lg shadow-indigo-500/20 ring-1 sm:ring-2 ring-indigo-200' 
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md sm:hover:shadow-lg'
            }`}
          >
            <Image 
              src={img} 
              alt={`${productName} thumbnail ${index + 1}`} 
              fill 
              style={{ objectFit: 'cover' }} 
              className="transition-transform duration-300"
            />
            {mainImage === img && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center"
              >
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

/**
 * Modern Product Information Component
 */
const ProductInformation: FC<{ product: Product }> = ({ product }) => {
  const { isLoggedIn } = useAuth();
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }} 
      animate={{ opacity: 1, x: 0 }} 
      transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      className="space-y-4 sm:space-y-6"
    >
      {/* Category Badge */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-indigo-50 text-indigo-700 text-xs sm:text-sm font-semibold border border-indigo-100">
          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          {product.category}
        </div>
      </motion.div>

      {/* Product Title */}
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
      >
        {product.name}
      </motion.h1>
      
      {/* Rating */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap items-center gap-2 sm:gap-3"
      >
        <StarRating rating={product.rating} />
        <span className="text-gray-600 font-medium text-sm sm:text-base">
          {product.rating.toFixed(1)} / 5.0
        </span>
        <span className="hidden sm:inline text-gray-400">•</span>
        <span className="text-gray-500 text-xs sm:text-sm">Premium Quality</span>
      </motion.div>

      {/* Badge */}
      {product.badge && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.55 }}
        >
          <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-yellow-500 text-white rounded-full text-xs sm:text-sm font-bold shadow-lg">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {product.badge}
          </div>
        </motion.div>
      )}

      {/* Description */}
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed"
      >
        {product.shortDescription}
      </motion.p>

      {/* Price Section */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="p-6 sm:p-8 bg-indigo-50 rounded-2xl sm:rounded-3xl border border-indigo-100 shadow-lg"
      >
        {isLoggedIn ? (
          product.price !== undefined ? (
            <div>
              <div className="flex items-baseline space-x-3 mb-2">
                <span className="text-4xl sm:text-5xl font-bold text-indigo-600">
                  {formatPrice(product.price)}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-green-600 font-semibold">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Available for Inquiry</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600 font-medium">Contact us for pricing</p>
            </div>
          )
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-gray-700 font-semibold mb-2">Member-Only Pricing</p>
            <p className="text-gray-500 text-sm mb-6">Sign in to view pricing information</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link 
                href="/login" 
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 hover:shadow-lg transition-all duration-300 text-center"
              >
                Log In
              </Link>
              <Link 
                href="/signup" 
                className="px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all duration-300 text-center"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </motion.div>

      {/* Key Features */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
          <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Key Features
        </h3>
        <div className="grid gap-3">
          {product.features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + i * 0.1 }}
              className="flex items-start p-4 bg-gray-50 rounded-xl hover:bg-indigo-50 hover:shadow-md transition-all duration-300 group"
            >
              <CheckIcon />
              <span className="text-gray-700 font-medium flex-1">{feature}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

/**
 * Modern Tabbed Section (Description & Specifications only)
 */
const ProductTabs: FC<{ product: Product }> = ({ product }) => {
  const [activeTab, setActiveTab] = useState('description');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'specs':
        return (
          <div className="grid gap-4">
            {Object.entries(product.specifications).map(([key, value], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 p-4 sm:p-6 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-100 hover:bg-indigo-50 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className="font-semibold text-gray-800 text-base sm:text-lg">{key}</span>
                </div>
                <span className="text-gray-600 font-medium text-left sm:text-right max-w-md break-words">{value}</span>
              </motion.div>
            ))}
          </div>
        );
      case 'description':
      default:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="prose prose-lg max-w-none"
          >
            <div className="text-gray-700 leading-relaxed text-base sm:text-lg space-y-3 sm:space-y-4">
              {product.longDescription.split('\n').map((paragraph, index) => (
                <p key={index} className="text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        );
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mt-8 sm:mt-12 bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 lg:p-12 border border-gray-100"
    >
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto" aria-label="Tabs">
          {[
            { id: 'description', label: 'Description', icon: '📄' },
            { id: 'specs', label: 'Specifications', icon: '⚙️' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`relative whitespace-nowrap py-3 sm:py-4 px-4 sm:px-8 border-b-3 font-semibold text-sm sm:text-base transition-all duration-300 rounded-t-lg sm:rounded-t-xl ${
                activeTab === tab.id 
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center space-x-1 sm:space-x-2">
                <span className="text-base sm:text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </nav>
      </div>
      
      <div className="min-h-[200px] sm:min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

/**
 * Modern Related Products Section
 */
const RelatedProducts: FC<{ products: Product[] }> = ({ products }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.4 }}
    className="mt-8 sm:mt-12 lg:mt-16"
  >
    <div className="mb-8">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">Related Products</h2>
      <p className="text-gray-600 text-sm sm:text-base">Discover similar products in this category</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {products.map((related, index) => (
        <motion.div
          key={related._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link 
            href={`/products/${related._id}`} 
            className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
              <Image 
                src={related.images[0]} 
                alt={related.name} 
                fill 
                style={{ objectFit: 'cover' }} 
                className="group-hover:scale-110 transition-transform duration-700 ease-out" 
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {related.badge && (
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 px-2 sm:px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full shadow-lg">
                  {related.badge}
                </div>
              )}
            </div>
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                  {related.category}
                </span>
                {related.rating && (
                  <div className="flex items-center space-x-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.round(related.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <h3 className="font-bold text-lg sm:text-xl text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 mb-2 line-clamp-1">
                {related.name}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-4">{related.shortDescription}</p>
              <div className="flex items-center justify-between">
                {related.price !== undefined && (
                  <span className="text-lg sm:text-xl font-bold text-gray-900">
                    {formatPrice(related.price)}
                  </span>
                )}
                <motion.div
                  className="flex items-center text-indigo-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ x: 5 }}
                >
                  <span>View Details</span>
                  <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

// --- MAIN PAGE COMPONENT ---
const ProductShowcasePage: FC<{ id: string }> = ({ id }) => {
  const { isOpen } = useSidebar();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      const productData = await fetchProductById(id);
      setProduct(productData);
      
      if (productData) {
        const allProducts = await fetchAllProducts();
        const related = allProducts
          .filter(p => p.category === productData.category && p._id !== productData._id)
          .slice(0, 3);
        setRelatedProducts(related);
      }
      setLoading(false);
    };
    
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you are looking for does not exist.</p>
          <Link 
            href="/products" 
            className="inline-flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 hover:shadow-lg transition-all duration-300"
          >
            <span>Back to Products</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className={`bg-gray-50 min-h-screen pb-12 sm:pb-20 ${isOpen ? 'md:ml-[310px]' : ''} transition-all duration-300`}>
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6 sm:py-8 md:py-12">
          {/* Modern Breadcrumbs */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 sm:mb-8"
          >
            <nav className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm flex-wrap">
              <Link href="/" className="text-gray-500 hover:text-indigo-600 transition-colors font-medium">
                Home
              </Link>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <Link href="/products" className="text-gray-500 hover:text-indigo-600 transition-colors font-medium">
                Products
              </Link>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-gray-900 font-semibold truncate max-w-[200px] sm:max-w-none">{product.name}</span>
            </nav>
          </motion.div>

          {/* Main Product Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16 items-start mb-8 sm:mb-12 lg:mb-16"
          >
            <ProductImageGallery images={product.images} productName={product.name} />
            <ProductInformation product={product} />
          </motion.div>

          {/* Details Section */}
          <ProductTabs product={product} />

          {/* Related Products Section */}
          {relatedProducts.length > 0 && <RelatedProducts products={relatedProducts} />}
        </main>
      </div>
    </>
  );
};

export default ProductShowcasePage;

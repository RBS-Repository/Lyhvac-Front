"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from './CategorySidebar';
import { useCMS } from './CMSContext';
import { API_ENDPOINTS } from '@/lib/api';

// --- Interfaces ---
interface Product {
  _id: string;
  name: string;
  category: string;
  images: string[];
  price: number;
  rating: number;
  badge: string | null;
  shortDescription: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
}

// --- Components ---

// 1. Skeleton Loader Component for better UX
const ProductSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 p-3">
    <div className="bg-gray-200 h-64 w-full rounded-xl animate-pulse mb-4" />
    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2" />
    <div className="h-3 bg-gray-200 rounded w-full animate-pulse mb-4" />
    <div className="flex justify-between items-center">
      <div className="h-5 bg-gray-200 rounded w-1/4 animate-pulse" />
      <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse" />
    </div>
  </div>
);

const CategorySelection = () => {
  const { isOpen, isRightSidebarOpen } = useSidebar();
  const { cmsData } = useCMS();
  const [activeCategory, setActiveCategory] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const { title, description } = cmsData.categorySelection;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(API_ENDPOINTS.products),
          fetch(API_ENDPOINTS.categories)
        ]);

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        setProducts(productsData);
        setCategories([{ _id: 'all', name: 'All Collection', slug: 'all', description: 'All products' }, ...categoriesData]);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0 // Cleaner look without decimals if possible
    }).format(price);
  };

  const displayProducts = activeCategory === 'all'
    ? products.slice(0, 8)
    : products.filter(p => p.category === activeCategory || p.category === categories.find(c => c._id === activeCategory)?.name).slice(0, 8);

  return (
    <section className={`py-20 bg-gray-50/50 ${isOpen ? 'md:ml-[310px]' : ''} ${isRightSidebarOpen ? 'lg:mr-[290px]' : ''} transition-all duration-500 ease-in-out`}>
      <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-8xl">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-gray-900 tracking-tight mb-4"
            >
              {title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-500 text-lg leading-relaxed"
            >
              {description}
            </motion.p>
          </div>

          {/* View All Link - Top Right for Desktop */}
          <Link
            href="/products"
            className="hidden md:inline-flex items-center font-semibold text-blue-600 hover:text-blue-700 transition-colors group"
          >
            View Full Catalog
            <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* Categories - Sliding Pill Design */}
        <div className="mb-12 overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex space-x-2 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm w-fit mx-auto md:mx-0">
            {loading ? (
              // Loading state for tabs
              [1, 2, 3, 4].map(i => <div key={i} className="h-10 w-24 bg-gray-100 rounded-xl animate-pulse" />)
            ) : (
              categories.map((category) => (
                <button
                  key={category._id}
                  onClick={() => setActiveCategory(category._id)}
                  className={`relative px-6 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 z-10 ${activeCategory === category._id ? 'text-white' : 'text-gray-500 hover:text-gray-900'
                    }`}
                >
                  {activeCategory === category._id && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute inset-0 bg-blue-600 rounded-xl -z-10 shadow-lg shadow-blue-600/20"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  {category.name}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Product Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <AnimatePresence mode='popLayout'>
            {loading ? (
              // Skeleton Loading
              Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
            ) : displayProducts.length > 0 ? (
              displayProducts.map((product) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={product._id}
                  className="group relative"
                >
                  <Link href={`/products/${product._id}`} className="block h-full">
                    <div className="h-full bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1">

                      {/* Image Container */}
                      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                        {product.badge && (
                          <div className="absolute top-3 left-3 z-20">
                            <span className="bg-white/90 backdrop-blur-sm text-blue-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                              {product.badge}
                            </span>
                          </div>
                        )}

                        <Image
                          src={product.images[0] || '/placeholder.jpg'}
                          alt={product.name}
                          width={400}
                          height={500}
                          className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-110"
                        />

                        {/* Quick Action Overlay */}
                        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/50 to-transparent flex justify-center">
                          <button className="bg-white text-gray-900 text-sm font-semibold px-6 py-2 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-colors w-full">
                            View Details
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">
                            {product.name}
                          </h3>
                        </div>
                        <p className="text-gray-500 text-sm mb-4 line-clamp-2 min-h-[40px]">
                          {product.shortDescription}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                          <span className="text-xl font-bold text-gray-900 tracking-tight">
                            {formatPrice(product.price)}
                          </span>
                          <span className="text-yellow-400 flex items-center text-sm font-medium">
                            ★ {product.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center"
              >
                <div className="bg-gray-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                <p className="text-gray-500">Try selecting a different category</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Mobile View All Button (Only shows on small screens) */}
        <div className="md:hidden mt-12 text-center">
          <Link
            href="/products"
            className="inline-block w-full bg-white border border-gray-200 text-gray-900 font-medium px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            View All Products
          </Link>
        </div>

      </div>
    </section>
  );
};

export default CategorySelection;
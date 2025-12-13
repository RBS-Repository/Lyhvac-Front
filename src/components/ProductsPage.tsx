"use client";

import { useState, useMemo, FC, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useSidebar } from './CategorySidebar';
import { useAuth } from './AuthContext';
import Header from './Header';

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
}

// Helper function to format PHP currency
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2
  }).format(price);
};

// --- HELPER COMPONENTS ---

// Product Card Component
const ProductCard: FC<{ product: Product }> = ({ product }) => {
  const { isLoggedIn } = useAuth();
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <Link href={`/products/${product._id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <Image
            src={product.images[0] || '/placeholder.jpg'}
            alt={product.name}
            fill
            style={{ objectFit: 'cover' }}
            className="group-hover:scale-110 transition-transform duration-500 ease-out"
          />
          {product.badge && (
            <div className="absolute top-3 right-3 px-2 sm:px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full shadow-lg">
              {product.badge}
            </div>
          )}
        </div>
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
              {product.category}
            </span>
            {product.rating > 0 && (
              <div className="flex items-center space-x-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3 h-3 sm:w-4 sm:h-4 ${i < Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            )}
          </div>
          <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-2">
            {product.shortDescription}
          </p>
          <div className="flex items-center justify-between">
            {isLoggedIn && product.price ? (
              <span className="text-lg sm:text-xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
            ) : (
              <span className="text-sm text-gray-500">Login to view price</span>
            )}
            <motion.div
              className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// --- MAIN PAGE COMPONENT ---
const ProductsPage = () => {
  const { isOpen } = useSidebar();
  const { isLoggedIn } = useAuth();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/products');
        const data = await res.json();
        setAllProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/categories');
        const data: Category[] = await res.json();
        const categoryNames = ["All", ...data.map(cat => cat.name)];
        setCategories(categoryNames);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    return allProducts
      .filter(product => {
        const categoryMatch = activeCategory === "All" || product.category === activeCategory;
        const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        return categoryMatch && searchMatch;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
        return 0;
      });
  }, [activeCategory, searchTerm, sortBy, allProducts]);

  return (
    <>
      <Header />
      <div className={`bg-gray-50 min-h-screen pb-12 sm:pb-20 ${isOpen ? 'md:ml-[310px]' : ''} transition-all duration-300`}>
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-indigo-900 text-white overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12 sm:py-16 md:py-20 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6"
            >
              Our Products
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl text-indigo-100 max-w-3xl mx-auto leading-relaxed px-4"
            >
              Discover our premium collection of HVAC solutions designed for modern living
              {!isLoggedIn && (
                <span className="block mt-2 sm:mt-3 text-sm sm:text-base">
                  <Link href="/login" className="underline hover:text-white transition-colors">Log in</Link> to view pricing
                </span>
              )}
            </motion.p>
          </div>
        </motion.section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6 sm:py-8 md:py-12">
          {/* Login Notice */}
          {!isLoggedIn && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6 sm:mb-8 rounded-xl sm:rounded-2xl border border-indigo-200 bg-indigo-50 text-indigo-800 px-4 sm:px-6 py-3 sm:py-4 shadow-sm"
            >
              <div className="flex items-start sm:items-center">
                <svg className="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0 mt-0.5 sm:mt-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs sm:text-sm font-medium">
                  Pricing is hidden. <Link href="/login" className="font-semibold underline hover:text-indigo-900">Log in</Link> or <Link href="/signup" className="font-semibold underline hover:text-indigo-900">create an account</Link> to view prices.
                </span>
              </div>
            </motion.div>
          )}

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
            >
              <span className="font-semibold text-gray-900 flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span>Filters</span>
              </span>
              <svg 
                className={`w-5 h-5 text-gray-500 transition-transform ${mobileFiltersOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Sidebar - Desktop Only */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8"
              >
                {/* Categories */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {categories.map((category: string) => (
                      <motion.button
                        key={category}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveCategory(category)}
                        className={`w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                          activeCategory === category 
                            ? 'bg-indigo-600 text-white shadow-md' 
                            : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                        }`}
                      >
                        {category}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                    Sort By
                  </h3>
                  <div className="space-y-2">
                    <motion.button
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSortBy('name-asc')}
                      className={`w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                        sortBy === 'name-asc'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                      }`}
                    >
                      Name (A–Z)
                    </motion.button>
                    <motion.button
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSortBy('name-desc')}
                      className={`w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                        sortBy === 'name-desc'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                      }`}
                    >
                      Name (Z–A)
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </aside>

            {/* Mobile Filters Dropdown */}
            <AnimatePresence>
              {mobileFiltersOpen && (
                <motion.aside
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="lg:hidden bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-4"
                >
                  {/* Categories */}
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-gray-900 mb-3">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category: string) => (
                        <button
                          key={category}
                          onClick={() => setActiveCategory(category)}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                            activeCategory === category 
                              ? 'bg-indigo-600 text-white shadow-md' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort */}
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-3">Sort By</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSortBy('name-asc')}
                        className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          sortBy === 'name-asc'
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Name (A–Z)
                      </button>
                      <button
                        onClick={() => setSortBy('name-desc')}
                        className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          sortBy === 'name-desc'
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Name (Z–A)
                      </button>
                    </div>
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Search Bar */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-6 sm:mb-8"
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 sm:py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 text-gray-900 placeholder-gray-400"
                  />
                </div>
              </motion.div>

              {/* Results Count */}
              <div className="mb-4 sm:mb-6 flex items-center justify-between">
                <p className="text-sm sm:text-base text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{filteredAndSortedProducts.length}</span> product{filteredAndSortedProducts.length !== 1 ? 's' : ''}
                </p>
                {activeCategory !== "All" && (
                  <button
                    onClick={() => setActiveCategory("All")}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center space-x-1"
                  >
                    <span>Clear filter</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Products Grid */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeCategory}-${searchTerm}-${sortBy}`}
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
                >
                  {filteredAndSortedProducts.length > 0 ? (
                    filteredAndSortedProducts.map((product, index) => (
                      <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="sm:col-span-2 xl:col-span-3 text-center py-12 sm:py-16 md:py-20"
                    >
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                        <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">No products found</h3>
                      <p className="text-gray-500 text-sm sm:text-base md:text-lg max-w-md mx-auto px-4">
                        Try adjusting your search or filters to find what you&apos;re looking for.
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsPage;

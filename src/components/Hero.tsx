"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useSidebar } from './CategorySidebar';
import { useCMS } from './CMSContext';
import { API_ENDPOINTS } from '@/lib/api';

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

const Hero = () => {
  const { isOpen, isRightSidebarOpen } = useSidebar();
  const { cmsData } = useCMS();
  const [activeProduct, setActiveProduct] = useState(0);
  const [hovered, setHovered] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Get data from CMS for fallback
  const { title, subtitle, description, selectedCategories } = cmsData.hero;

  // Fetch real products and categories based on selectedCategories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(API_ENDPOINTS.products),
          fetch(API_ENDPOINTS.categories)
        ]);
        
        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        
        // Filter categories based on selectedCategories from CMS
        let filteredCategories: Category[] = [];
        if (selectedCategories && selectedCategories.length > 0) {
          filteredCategories = categoriesData.filter((cat: Category) => 
            selectedCategories.includes(cat._id)
          );
        } else {
          filteredCategories = categoriesData.slice(0, 3);
        }
        
        // Filter products based on selected categories
        let filteredProducts: Product[] = [];
        if (filteredCategories.length > 0) {
          filteredCategories.forEach((category: Category) => {
            const categoryProduct = productsData.find((p: Product) => 
              p.category === category.name || p.category === category._id
            );
            if (categoryProduct && filteredProducts.length < 3) {
              filteredProducts.push(categoryProduct);
            }
          });
          
          if (filteredProducts.length < 3) {
            const remaining = productsData.filter((p: Product) => 
              !filteredProducts.some(fp => fp._id === p._id)
            );
            filteredProducts = [...filteredProducts, ...remaining.slice(0, 3 - filteredProducts.length)];
          }
        } else {
          filteredProducts = productsData.slice(0, 3);
        }
        
        setProducts(filteredProducts.slice(0, 3));
        setCategories(filteredCategories.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategories]);

  // Auto-rotate products
  useEffect(() => {
    if (!hovered && products.length > 0) {
      const interval = setInterval(() => {
        setActiveProduct((prev) => (prev + 1) % products.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [hovered, products.length]);

  // Format price to PHP
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(price);
  };

  // Render stars for rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto"
          />
          <p className="mt-6 text-gray-600 font-medium">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Category Quick Navigation */}
      {categories.length > 0 && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`bg-white border-b border-gray-100 shadow-sm ${isOpen ? 'md:ml-[310px]' : ''} ${isRightSidebarOpen ? 'lg:mr-[290px]' : ''} transition-all duration-300`}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex items-center justify-between py-4 overflow-x-auto hide-scrollbar">
              <div className="flex items-center space-x-1 md:space-x-3">
                {categories.map((category, index) => (
                  <motion.div
                    key={category._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={`/products?category=${category.slug || category.name}`}
                      className="group flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-50 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 border border-transparent hover:border-indigo-200"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      <span className="font-semibold text-sm text-gray-700 group-hover:text-indigo-700 transition-colors whitespace-nowrap">
                        {category.name}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
              <Link
                href="/products"
                className="ml-4 px-4 py-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 whitespace-nowrap flex items-center space-x-1 group"
              >
                <span>View All</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Hero Section */}
      <div
        ref={heroRef}
        className={`relative overflow-hidden ${isOpen ? 'md:ml-[310px]' : ''} ${isRightSidebarOpen ? 'lg:mr-[290px]' : ''} transition-all duration-300`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Modern Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
          {/* Animated gradient orbs */}
          <motion.div
            className="absolute top-0 -left-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-0 -right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Content Container */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-16 md:py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Side - Content */}
            <div className="space-y-8">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
              >
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-white/90">Premium HVAC Solutions</span>
              </motion.div>

              {/* Headline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="space-y-4"
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="text-white">{title}</span>
                  <br />
                  <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {subtitle}
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-lg">
                  {description}
                </p>
              </motion.div>

              {/* Product Showcase - Compact */}
              {products.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">Featured</h3>
                    <div className="flex space-x-1">
                      {products.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveProduct(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            activeProduct === index ? 'bg-white w-6' : 'bg-white/30'
                          }`}
                          aria-label={`View product ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeProduct}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-white mb-1">
                            {products[activeProduct]?.name}
                          </h4>
                          <p className="text-sm text-gray-300 mb-3">
                            {products[activeProduct]?.shortDescription}
                          </p>
                          <div className="flex items-center space-x-4">
                            <span className="text-2xl font-bold text-white">
                              {formatPrice(products[activeProduct]?.price || 0)}
                            </span>
                            {products[activeProduct]?.rating && (
                              <div className="flex items-center space-x-1">
                                {renderStars(products[activeProduct].rating)}
                              </div>
                            )}
                          </div>
                        </div>
                        {products[activeProduct]?.badge && (
                          <div className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg text-white text-xs font-bold">
                            {products[activeProduct].badge}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              )}

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  href="/products"
                  className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-center overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <span>Explore Products</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <Link
                  href="/services"
                  className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/20 text-white rounded-xl font-semibold text-center hover:bg-white/20 transition-all duration-300"
                >
                  Our Services
                </Link>
              </motion.div>

              {/* Stats or Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid grid-cols-3 gap-4 pt-4"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">500+</div>
                  <div className="text-sm text-gray-400">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">10K+</div>
                  <div className="text-sm text-gray-400">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-sm text-gray-400">Support</div>
                </div>
              </motion.div>
            </div>

            {/* Right Side - Product Image Showcase */}
            {products.length > 0 && (
              <div className="relative hidden lg:block">
                <div className="relative h-[600px]">
                  <AnimatePresence mode="wait">
                    {products.map((product, index) => (
                      activeProduct === index && (
                        <motion.div
                          key={product._id}
                          initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                          exit={{ opacity: 0, scale: 0.8, rotateY: 20 }}
                          transition={{ duration: 0.5 }}
                          className="absolute inset-0"
                        >
                          <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10">
                            <Image
                              src={product.images[0] || '/placeholder.jpg'}
                              alt={product.name}
                              fill
                              className="object-cover"
                              priority={index === 0}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-8">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <h3 className="text-2xl font-bold text-white mb-1">{product.name}</h3>
                                  <p className="text-gray-300 text-sm">{product.category}</p>
                                </div>
                                <div className="text-right">
                                  <div className="text-3xl font-bold text-white">{formatPrice(product.price)}</div>
                                  {product.rating && (
                                    <div className="flex items-center justify-end space-x-1 mt-1">
                                      {renderStars(product.rating)}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <Link
                                href={`/products/${product._id}`}
                                className="inline-block w-full text-center px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      )
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-24 md:h-32">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" />
          </svg>
        </div>
      </div>

      {/* Featured Products Grid */}
      {products.length > 0 && (
        <div className={`bg-gradient-to-b from-white to-gray-50 py-20 ${isOpen ? 'md:ml-[310px]' : ''} ${isRightSidebarOpen ? 'lg:mr-[290px]' : ''} transition-all duration-300`}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover our top-rated HVAC solutions designed for efficiency, comfort, and innovation
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    href={`/products/${product._id}`}
                    className="group block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100"
                  >
                    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                      <Image
                        src={product.images[0] || '/placeholder.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {product.badge && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold rounded-full shadow-lg">
                          {product.badge}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                        {product.rating && (
                          <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                            {renderStars(product.rating)}
                          </div>
                        )}
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                        {product.shortDescription}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-indigo-600 font-semibold text-sm flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>View</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center mt-12"
            >
              <Link
                href="/products"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <span>View All Products</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;

"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
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

const CategorySelection = () => {
  const { isOpen, isRightSidebarOpen } = useSidebar();
  const { cmsData } = useCMS();
  const [activeCategory, setActiveCategory] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Get data from CMS for fallback
  const { title, description } = cmsData.categorySelection;

  // Fetch real products and categories
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
        setCategories([{ _id: 'all', name: 'All', slug: 'all', description: 'All products' }, ...categoriesData]);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format price to PHP
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(price);
  };

  // Filter products by category
  const displayProducts = activeCategory === 'all' 
    ? products.slice(0, 8) 
    : products.filter(p => p.category === activeCategory || p.category === categories.find(c => c._id === activeCategory)?.name).slice(0, 8);

  if (loading) {
    return (
      <section className={`py-16 bg-white ${isOpen ? 'md:ml-[310px]' : ''} ${isRightSidebarOpen ? 'lg:mr-[290px]' : ''} transition-all duration-300`}>
        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-7xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading categories...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-16 bg-white ${isOpen ? 'md:ml-[310px]' : ''} ${isRightSidebarOpen ? 'lg:mr-[290px]' : ''} transition-all duration-300`}>
      <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Category selection - clean horizontal scrolling */}
        <div className="mb-12 overflow-x-auto hide-scrollbar">
          <div className="flex space-x-4 min-w-max px-2 py-2">
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => setActiveCategory(category._id)}
                className={`relative flex items-center px-5 py-3 rounded-lg transition-all duration-300 ${
                  activeCategory === category._id 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2 text-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </span>
                <span className="font-medium">{category.name}</span>
                {activeCategory === category._id && (
                  <motion.span 
                    layoutId="categoryIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Products grid with minimalist design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {displayProducts.length > 0 ? displayProducts.map((product) => (
            <Link 
              key={product._id} 
              href={`/products/${product._id}`}
              className="group"
            >
              <div className="bg-gray-50 border border-gray-100 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md">
                <div className="relative aspect-square overflow-hidden">
                  <Image 
                    src={product.images[0] || '/placeholder.jpg'} 
                    alt={product.name}
                    width={300}
                    height={300}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                  {product.badge && (
                    <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {product.badge}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-medium text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.shortDescription}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
                    <span className="text-sm text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      View Details →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No products found in this category.</p>
            </div>
          )}
        </div>

        {/* View all button */}
        <div className="text-center mt-12">
          <Link 
            href="/products"
            className="inline-flex items-center justify-center border-2 border-blue-600 bg-white text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-md font-medium transition-colors"
          >
            View All {activeCategory !== 'all' ? categories.find(c => c._id === activeCategory)?.name : 'Products'}
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategorySelection; 
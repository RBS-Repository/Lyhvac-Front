"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSidebar } from './CategorySidebar';
import { useCMS } from './CMSContext';
import { API_ENDPOINTS } from '@/lib/api';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: string; // Add image field if your CMS supports it
}

const CategorySelection = () => {
  const { isOpen, isRightSidebarOpen } = useSidebar();
  const { cmsData } = useCMS();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const { title, description } = cmsData.categorySelection;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.categories);
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className={`py-16 bg-white ${isOpen ? 'md:ml-[310px]' : ''} ${isRightSidebarOpen ? 'lg:mr-[290px]' : ''} transition-all duration-500`}>
      <div className="container mx-auto px-6 max-w-7xl">

        {/* Simplified Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            {title || "Shop by Category"}
          </motion.h2>
          <motion.p className="text-gray-500 max-w-xl mx-auto">
            {description || "Explore our curated collections across all departments."}
          </motion.p>
        </div>

        {/* Category Grid - 2 to 4 columns depending on screen */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-40 bg-gray-100 animate-pulse rounded-2xl" />
            ))
          ) : (
            categories.map((category, index) => (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
              >
                <Link
                  href={`/products?category=${category.slug}`}
                  className="group relative block aspect-square md:aspect-video lg:aspect-square overflow-hidden rounded-2xl bg-gray-100 border border-gray-100 shadow-sm"
                >
                  {/* Background Decoration (Optional: Use real images if available) */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 group-hover:from-blue-600 group-hover:to-indigo-700 transition-colors duration-300" />

                  <div className="relative h-full p-6 flex flex-col justify-end">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-white transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-500 group-hover:text-blue-100 mt-1 line-clamp-1 transition-colors">
                      {category.description}
                    </p>
                    <div className="mt-4 flex items-center text-blue-600 group-hover:text-white text-sm font-semibold">
                      Browse →
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default CategorySelection;
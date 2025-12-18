"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSidebar } from './CategorySidebar';
import { useCMS } from './CMSContext';
import { API_ENDPOINTS } from '@/lib/api';

const CategorySelection = () => {
  const { isOpen, isRightSidebarOpen } = useSidebar();
  const { cmsData } = useCMS();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.categories);
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className={`py-16 bg-gray-50/50 transition-all duration-500 ${isOpen ? 'md:ml-[310px]' : ''} ${isRightSidebarOpen ? 'lg:mr-[290px]' : ''}`}>
      <div className="container mx-auto px-6 max-w-7xl">

        {/* Header - Aligned with a clean professional look */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              Shop by Department
            </h2>
            <p className="text-gray-500 mt-2 max-w-lg">
              Select a category to filter our full range of professional products.
            </p>
          </div>
          <Link href="/products" className="text-sm font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-4">
            View All Categories
          </Link>
        </div>

        {/* Scalable Grid - Handles any number of categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-24 bg-white border border-gray-100 rounded-2xl animate-pulse" />
            ))
          ) : (
            categories.map((cat, i) => (
              <motion.div
                key={cat._id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/products?category=${cat.slug}`}
                  className="group relative flex items-center p-6 bg-white border border-gray-200 rounded-2xl transition-all duration-300 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-1"
                >
                  {/* Icon Placeholder / Initial Letter */}
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-bold text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    {cat.name.charAt(0)}
                  </div>

                  <div className="ml-4 overflow-hidden">
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      Explore Series →
                    </p>
                  </div>

                  {/* Subtle Background Number */}
                  <span className="absolute top-4 right-6 text-4xl font-black text-gray-50 group-hover:text-blue-50 transition-colors pointer-events-none">
                    {i + 1}
                  </span>
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
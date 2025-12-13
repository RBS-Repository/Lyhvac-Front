"use client";

import { useState, createContext, useContext, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Create a context for sidebar state
interface SidebarContextType {
  isOpen: boolean;
  toggleSidebar: () => void;
  isRightSidebarOpen: boolean;
  toggleRightSidebar: () => void;
}

export const SidebarContext = createContext<SidebarContextType>({
  isOpen: false,
  toggleSidebar: () => {},
  isRightSidebarOpen: true,
  toggleRightSidebar: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen);
  };
  
  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar, isRightSidebarOpen, toggleRightSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
}

const CategorySidebar = () => {
  const { isOpen, toggleSidebar } = useSidebar();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories from MongoDB
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/categories');
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
    <>
      {/* Desktop sidebar - only visible on md and larger screens */}
      <div className="hidden md:block fixed left-0 top-[60px] z-40 h-[calc(100vh-120px)]">
        <div className="relative h-full">
          {/* Toggle button */}
          <button 
            onClick={toggleSidebar}
            className={`absolute left-0 top-0 w-10 h-10 ${isOpen ? 'bg-indigo-900' : 'bg-blue-600'} text-white flex items-center justify-center`}
            aria-label={isOpen ? "Close categories" : "Open categories"}
          >
            {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
          
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 300, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="h-full overflow-y-auto shadow-lg border-r border-gray-200 bg-white ml-10"
              >
                {/* Header */}
                <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
                  <span className="text-lg font-bold">All Categories</span>
                  <button 
                    onClick={toggleSidebar}
                    className="text-white hover:text-gray-200"
                    aria-label="Close categories"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Categories list */}
                <div className="p-2">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-sm text-gray-500">Loading...</p>
                    </div>
                  ) : categories.length > 0 ? (
                    <ul className="space-y-1">
                      {categories.map((category, index) => (
                        <li key={category._id}>
                          <Link 
                            href="/products"
                            className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 rounded transition-colors"
                            onMouseEnter={() => setActiveCategory(category._id)}
                            onMouseLeave={() => setActiveCategory(null)}
                          >
                            <span className="text-blue-600 font-medium mr-2">{index + 1}.</span>
                            <div className="flex-1">
                              <span className={`block ${activeCategory === category._id ? 'text-blue-600 font-medium' : 'text-gray-800'}`}>
                                {category.name}
                              </span>
                              {category.description && (
                                <span className="text-xs text-gray-500 line-clamp-1">
                                  {category.description}
                                </span>
                              )}
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-gray-500">No categories available</p>
                      <Link href="/admin/cms" className="text-xs text-blue-600 hover:underline mt-2 block">
                        Add categories in CMS
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default CategorySidebar; 
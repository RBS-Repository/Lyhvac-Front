"use client";

import Link from 'next/link';
import { useSidebar } from './CategorySidebar';
import { useCMS } from './CMSContext';
import { motion, AnimatePresence } from 'framer-motion';

const RightSidebar = () => {
  const { isRightSidebarOpen, toggleRightSidebar } = useSidebar();
  const { cmsData } = useCMS();
  
  // Get sidebar data from CMS
  const { customerServicePhone, customerServiceFax, customerServiceEmail, customerServiceHours } = cmsData.rightSidebar;
  
  return (
    <div className="hidden lg:block fixed right-0 top-[60px] z-40 h-[calc(100vh-60px)]">
      <div className="relative h-full">
        {/* Toggle button */}
        <button 
          onClick={toggleRightSidebar}
          className={`absolute right-0 top-0 w-10 h-10 ${isRightSidebarOpen ? 'bg-blue-600' : 'bg-blue-600'} text-white flex items-center justify-center`}
          aria-label={isRightSidebarOpen ? "Hide quick menu" : "Show quick menu"}
        >
          {isRightSidebarOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          )}
        </button>
        
        <AnimatePresence>
          {isRightSidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0, x: 280 }}
              animate={{ width: 280, opacity: 1, x: 0 }}
              exit={{ width: 0, opacity: 0, x: 280 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="h-full overflow-y-auto shadow-lg border-l border-gray-200 bg-white mr-10"
            >
              <div className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-800">Quick Menu</h3>
                  <button 
                    onClick={toggleRightSidebar}
                    className="text-gray-500 hover:text-gray-700"
                    aria-label="Close quick menu"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Quick Menu */}
                <div className="mb-6">
                  <div className="grid grid-cols-3 gap-2">
               
                    <Link href="/products" className="flex flex-col items-center justify-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <span className="text-xs text-gray-700">Product Catalog</span>
                    </Link>
                    <Link href="/recent" className="flex flex-col items-center justify-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <span className="text-xs text-gray-700">Recently viewed</span>
                    </Link>
                    <Link href="/account" className="flex flex-col items-center justify-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <span className="text-xs text-gray-700">My Page</span>
                    </Link>
                    <Link href="/customer-service" className="flex flex-col items-center justify-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <span className="text-xs text-gray-700">Customer Service</span>
                    </Link>
              
                  </div>
                </div>
                
              
                
                {/* Customer Service Center */}
                <div>
                  <h3 className="font-medium text-gray-800 mb-3">Customer Service Center</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-xl font-bold text-amber-500">{customerServicePhone}</p>
                      <p className="text-gray-600">FAX {customerServiceFax}</p>
                    </div>
                    <div>
                      {customerServiceHours.map((hour, index) => (
                        <p key={index} className="text-gray-600">{hour}</p>
                      ))}
                    </div>
                    <div className="pt-1">
                      <p className="text-gray-600">{customerServiceEmail}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RightSidebar; 
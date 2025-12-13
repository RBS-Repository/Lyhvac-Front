"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { useSidebar } from './CategorySidebar';

const Footer = () => {
  const { isOpen, isRightSidebarOpen } = useSidebar(); // Get sidebar state
  // Use state for the year to avoid hydration mismatch
  const [currentYear, setCurrentYear] = useState(2023);
  const [email, setEmail] = useState('');
  
  // Update the year on the client side after component mounts
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the newsletter subscription
    console.log('Newsletter subscription for:', email);
    setEmail('');
    // Show success message or handle accordingly
  };

  // Categories for the footer
  const categories = [
    { name: "Residential", items: ["Home AC Systems", "Home Heating", "Smart Thermostats", "Air Purifiers"] },
    { name: "Commercial", items: ["Office HVAC", "Industrial Solutions", "Building Management", "Energy Efficiency"] },
    { name: "Parts & Accessories", items: ["Filters", "Thermostats", "Vents & Grills", "Installation Kits"] },
    { name: "Services", items: ["Installation", "Maintenance", "Repair", "Consultation"] }
  ];

  return (
    <footer className={`bg-white text-gray-700 ${isOpen ? 'md:ml-[310px]' : ''} ${isRightSidebarOpen ? 'lg:mr-[290px]' : ''} transition-all duration-300`}>
      {/* Top border accent - Korean-inspired design element */}
      <div className="h-1.5 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600"></div>
      
      {/* Newsletter Section with Korean-inspired aesthetic */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-7xl">
          <div className="max-w-4xl mx-auto text-center mb-10">
            <h3 className="text-2xl font-bold mb-3">Subscribe to Our Newsletter</h3>
            <p className="text-gray-600 max-w-xl mx-auto">
              Stay updated with LY HVAC&apos;s latest products, innovations, and seasonal maintenance tips
            </p>
          </div>
          <div className="max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow px-5 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
              <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-md transition-colors sm:flex-shrink-0"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-7xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Company Info */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-gray-800">LY <span className="text-blue-600">HVAC</span></span>
              </div>
            </Link>
            <p className="text-gray-600 mb-6 leading-relaxed">
              LY HVAC provides premium heating, ventilation, and air conditioning systems and parts for residential and commercial properties. With over 15 years of expertise, we deliver comfort solutions that blend Korean precision with innovative technology.
            </p>
            <div className="flex space-x-4 mb-8">
              <a href="#" className="bg-gray-100 hover:bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center transition-colors" aria-label="Facebook">
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
              <a href="#" className="bg-gray-100 hover:bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="bg-gray-100 hover:bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
            
            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-600">
                    1234 Main Street<br />
                    Anytown, USA 12345
                  </span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-600">(555) 123-4567</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-600">info@lyhvac.com</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Categories - Korean-inspired layout with clean lines and spacing */}
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2">{category.name}</h3>
                <ul className="space-y-2">
                  {category.items.map((item, idx) => (
                    <li key={idx}>
                      <Link href={`/products/${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar with Korean-inspired minimalist design */}
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-7xl py-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {currentYear} LY HVAC Systems & Parts. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center space-x-6 text-sm text-gray-500">
              <Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link>
              <Link href="/warranty" className="hover:text-blue-600 transition-colors">Warranty</Link>
              <Link href="/sitemap" className="hover:text-blue-600 transition-colors">Sitemap</Link>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4 pb-16 text-center">
            <p className="text-gray-500 text-sm">
              Website Design and Developed by{' '}
              <a
                href="https://budaquecreations.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-blue-600 hover:underline"
              >
Budaque Creation              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 

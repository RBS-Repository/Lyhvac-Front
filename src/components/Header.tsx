"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './AuthContext';

const Header = () => {
  const { isLoggedIn, isAdmin, logout, userEmail, userName } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  // const [cartCount, setCartCount] = useState(0); // Mock cart state

  // Sample navigation items
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Services", path: "/services" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      // Get banner height (approximately 40px) + category nav height (approximately 48px)
      const bannerHeight = 88;
      setScrolled(window.scrollY > bannerHeight);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isUserDropdownOpen) {
        setIsUserDropdownOpen(false);
      }
    };

    if (isUserDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isUserDropdownOpen]);

  return (
    <header 
      className={`sticky top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-3' : 'bg-gray-800 py-4'
      }`}
    >
      {/* Korean-inspired accent line */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 ${
        scrolled ? 'opacity-100' : 'opacity-0'
      } transition-opacity duration-300`}></div>
      
      <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className={`text-2xl font-bold ${scrolled ? 'text-gray-900' : 'text-white'}`}>
              LY <span className="text-blue-600">HVAC</span>
            </span>
            <span className={`ml-2 text-xs uppercase tracking-wider ${scrolled ? 'text-gray-600' : 'text-gray-300'}`}>
              Systems & Parts
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-10">
            {navItems.map((item) => (
              <Link 
                key={item.name}
                href={item.path}
                className={`relative ${scrolled ? 'text-gray-900' : 'text-white'} hover:text-blue-600 transition-colors font-medium`}
                onClick={() => setActiveSection(item.name.toLowerCase())}
              >
                {item.name}
                {activeSection === item.name.toLowerCase() && (
                  <motion.span 
                    layoutId="navIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Search */}
            <button 
              className={`${scrolled ? 'text-gray-900' : 'text-white'} hover:text-blue-600 transition-colors`}
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Admin CMS Link - visible only to admin users */}
            {isAdmin && (
            <Link 
              href="/admin/cms"
              className={`flex items-center space-x-1 ${scrolled ? 'text-gray-900' : 'text-white'} hover:text-blue-600 transition-colors font-medium`}
              title="Content Management System"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Admin</span>
            </Link>
            )}

            {/* Auth */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsUserDropdownOpen(!isUserDropdownOpen);
                  }}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center ${scrolled ? 'ring-2 ring-white' : ''}`}>
                    <span className="text-white text-sm font-bold">
                      {userName ? userName.charAt(0).toUpperCase() : (userEmail ? userEmail.charAt(0).toUpperCase() : 'U')}
                    </span>
                  </div>
                  <svg className={`w-4 h-4 ${scrolled ? 'text-gray-900' : 'text-white'} transition-colors`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User Dropdown */}
                <AnimatePresence>
                  {isUserDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                    >
                      <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <span className="text-white text-lg font-bold">
                              {userName ? userName.charAt(0).toUpperCase() : (userEmail ? userEmail.charAt(0).toUpperCase() : 'U')}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-bold truncate">{userName || 'User'}</p>
                            <p className="text-blue-100 text-sm truncate">{userEmail}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-2">
                        <Link
                          href="/account"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                          <svg className="w-5 h-5 text-gray-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="text-gray-900 font-medium group-hover:text-blue-600">My Account</span>
                        </Link>
                        
                        {isAdmin && (
                          <Link
                            href="/admin/products"
                            onClick={() => setIsUserDropdownOpen(false)}
                            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors group"
                          >
                            <svg className="w-5 h-5 text-gray-600 group-hover:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <span className="text-gray-900 font-medium group-hover:text-purple-600">Admin Panel</span>
                          </Link>
                        )}
                        
                        <div className="border-t border-gray-200 my-2"></div>
                        
                        <button
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            logout();
                          }}
                          className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 transition-colors group w-full text-left"
                        >
                          <svg className="w-5 h-5 text-gray-600 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span className="text-gray-900 font-medium group-hover:text-red-600">Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className={`${scrolled ? 'text-gray-900' : 'text-white'} hover:text-blue-600 transition-colors`}>Login</Link>
                <Link href="/signup" className={`${scrolled ? 'text-gray-900' : 'text-white'} hover:text-blue-600 transition-colors`}>Sign up</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={`lg:hidden ${scrolled ? 'text-gray-900' : 'text-white'}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg 
              className={`w-6 h-6 ${isMenuOpen ? 'hidden' : 'block'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg 
              className={`w-6 h-6 ${isMenuOpen ? 'block' : 'hidden'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t"
          >
            <div className="container mx-auto px-6 md:px-12 py-4">
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    className="text-gray-900 hover:text-blue-600 py-2 transition-colors font-medium"
                    onClick={() => {
                      setActiveSection(item.name.toLowerCase());
                      setIsMenuOpen(false);
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
              
              <div className="flex items-center space-x-6 mt-6 pt-6 border-t">
                <Link href="/search" className="text-gray-900 hover:text-blue-600 transition-colors">
                  Search
                </Link>
                <Link href="/account" className="text-gray-900 hover:text-blue-600 transition-colors">
                  My Account
                </Link>
                {isAdmin && (
                <Link href="/admin/cms" className="text-gray-900 hover:text-blue-600 transition-colors font-medium">
                  Admin CMS
                </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header; 
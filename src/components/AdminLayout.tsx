"use client";

import { ReactNode, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './AuthContext';

interface AdminLayoutProps {
  children: ReactNode;
  onCMSTabChange?: (tab: string) => void;
  currentCMSTab?: string;
}

interface NavItem {
  name: string;
  href?: string;
  icon: ReactNode;
  badge?: string;
  subItems?: { name: string; href: string; icon: string }[];
  description?: string;
}

const AdminLayout = ({ children, onCMSTabChange, currentCMSTab }: AdminLayoutProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { userName, userEmail, logout, isLoggedIn, isAdmin, authReady } = useAuth();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Load sidebar state from localStorage
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('adminSidebarOpen');
      return saved !== null ? JSON.parse(saved) : true;
    }
    return true;
  });

  // Auto-expand items with active sub-items
  const getInitialExpandedItems = useCallback(() => {
    if (pathname?.includes('/admin/cms')) {
      return ['Content CMS'];
    }
    return [];
  }, [pathname]);

  const [expandedItems, setExpandedItems] = useState<string[]>(getInitialExpandedItems);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Save sidebar state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminSidebarOpen', JSON.stringify(sidebarOpen));
    }
  }, [sidebarOpen]);

  // Auto-expand active items on route change
  useEffect(() => {
    const newExpanded = getInitialExpandedItems();
    setExpandedItems(newExpanded);
  }, [pathname, getInitialExpandedItems]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change and restore focus
  useEffect(() => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
      // Return focus to the menu toggle button after route change
      const timer = setTimeout(() => {
        const toggleButton = document.querySelector('[aria-label="Toggle menu"]') as HTMLButtonElement;
        toggleButton?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [pathname, mobileMenuOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Esc key closes menus
      if (e.key === 'Escape') {
        setUserMenuOpen(false);
        setMobileMenuOpen(false);
      }
      // Cmd/Ctrl + K focuses search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      // / focuses search
      if (e.key === '/' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigation: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/admin',
      description: 'Overview and quick stats',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      name: 'Content CMS',
      description: 'Manage website content',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      subItems: [
        { name: 'Hero Section', href: '/admin/cms?tab=hero', icon: '🎯' },
        { name: 'Product Ads', href: '/admin/cms?tab=ads', icon: '📢' },
        { name: 'Product Showcase', href: '/admin/cms?tab=product-showcase', icon: '🎪' },
        { name: 'Media & Reviews', href: '/admin/cms?tab=media', icon: '⭐' },
        { name: 'Category Section', href: '/admin/cms?tab=categories', icon: '🏷️' },
        { name: 'Products', href: '/admin/cms?tab=products', icon: '📦' },
        { name: 'Categories', href: '/admin/cms?tab=category-management', icon: '🗂️' },
        { name: 'Contact Section', href: '/admin/cms?tab=contact', icon: '📧' },
        { name: 'Contact Page', href: '/admin/cms?tab=contact-page', icon: '📄' },
        { name: 'Right Sidebar', href: '/admin/cms?tab=sidebar', icon: '📞' },
      ]
    },
    {
      name: 'Products',
      href: '/admin/products',
      description: 'Manage products inventory',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      name: 'Users',
      href: '/admin/users',
      description: 'Manage user accounts',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
  ];

  // Filter navigation based on search (memoized)
  const filteredNavigation = useMemo(() => {
    return navigation.map(item => {
      if (item.subItems) {
        const filteredSubItems = item.subItems.filter(subItem =>
          subItem.name.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
        return { ...item, subItems: filteredSubItems };
      }
      return item;
    }).filter(item => {
      if (debouncedSearch) {
        const matchesName = item.name.toLowerCase().includes(debouncedSearch.toLowerCase());
        const matchesSubItems = item.subItems?.some(subItem =>
          subItem.name.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
        return matchesName || matchesSubItems;
      }
      return true;
    });
  }, [debouncedSearch]);

  const getPageTitle = () => {
    if (pathname === '/admin') return 'Dashboard';
    if (pathname === '/admin/products') return 'Products';
    if (pathname === '/admin/users') return 'Users';
    if (pathname === '/admin/cms') return 'Content Management';
    return 'Admin Panel';
  };

  const toggleExpand = useCallback((name: string) => {
    setExpandedItems(prev =>
      prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name]
    );
  }, []);

  const handleSubItemClick = useCallback((href: string, e: React.MouseEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(href.split('?')[1]);
    const tab = params.get('tab');
    if (tab && onCMSTabChange) {
      onCMSTabChange(tab);
    }
    router.push(href);
    setMobileMenuOpen(false);
  }, [onCMSTabChange, router]);
  useEffect(() => {
    if (!authReady) return;
    if (!isLoggedIn) {
      router.replace('/login');
      return;
    }
    if (!isAdmin) {
      router.replace('/');
    }
  }, [authReady, isLoggedIn, isAdmin, router]);

  if (!authReady || !isLoggedIn || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Top Navigation Bar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white border-b border-gray-200 fixed w-full z-30 top-0 shadow-sm"
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Logo & Menu Toggle */}
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>

              {/* Desktop Sidebar Toggle */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:block p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all active:scale-95"
                aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              >
                <motion.svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ rotate: sidebarOpen ? 0 : 180 }}
                  transition={{ duration: 0.2 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </motion.svg>
              </button>

              <Link href="/admin" className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-gray-900">HVAC Admin</h1>
                  <p className="text-xs text-gray-500">Control Panel</p>
                </div>
              </Link>
            </div>

            {/* Right: Page Title & Actions */}
            <div className="flex items-center space-x-4">
              {/* Page Title (Desktop) */}
              <div className="hidden md:block">
                <h2 className="text-lg font-semibold text-gray-900">{getPageTitle()}</h2>
              </div>

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                    {userName ? userName.charAt(0).toUpperCase() : userEmail?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">{userName || 'Admin'}</p>
                    <p className="text-xs text-gray-500">{userEmail}</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-500 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User Dropdown */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                        <p className="text-sm font-semibold text-gray-900">{userName || 'Admin User'}</p>
                        <p className="text-xs text-gray-600 mt-1">{userEmail}</p>
                      </div>
                      <div className="py-2">
                        <Link
                          href="/account"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          My Account
                        </Link>
                        <Link
                          href="/"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                          </svg>
                          Back to Site
                        </Link>
                        <button
                          onClick={logout}
                          className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
          </>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : -288,
          width: sidebarOpen ? 288 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 overflow-hidden z-30 shadow-xl ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          } lg:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100/50">
            <div className="relative group">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search menu... (Press /)"
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm focus:shadow-md"
                aria-label="Search navigation menu"
              />
              {searchQuery ? (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    searchInputRef.current?.focus();
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Clear search"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ) : (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-400 bg-gray-100 border border-gray-300 rounded">/</kbd>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {filteredNavigation.map((item, index) => {
              const isActive = item.href && (pathname === item.href || pathname?.startsWith(item.href + '/'));
              const isExpanded = expandedItems.includes(item.name);
              const hasSubItems = item.subItems && item.subItems.length > 0;

              return (
                <motion.div
                  key={item.name}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {hasSubItems ? (
                    <>
                      <motion.button
                        onClick={() => toggleExpand(item.name)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${pathname?.includes('/admin/cms')
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                            : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        aria-expanded={isExpanded}
                        aria-controls={`submenu-${item.name}`}
                      >
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className={`flex-shrink-0 ${pathname?.includes('/admin/cms') ? 'text-white' : 'text-gray-500'}`}>
                            {item.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="font-semibold text-sm block truncate">{item.name}</span>
                            {item.description && (
                              <p className={`text-xs mt-0.5 truncate ${pathname?.includes('/admin/cms') ? 'text-indigo-100' : 'text-gray-500'
                                }`}>
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <motion.svg
                          className={`w-4 h-4 flex-shrink-0 ${pathname?.includes('/admin/cms') ? 'text-white' : 'text-gray-400'}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </motion.svg>
                      </motion.button>

                      <motion.div
                        id={`submenu-${item.name}`}
                        initial={false}
                        animate={{
                          height: isExpanded ? 'auto' : 0,
                          opacity: isExpanded ? 1 : 0
                        }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                        aria-hidden={!isExpanded}
                      >
                        <div className="ml-2 mt-2 space-y-1 border-l-2 border-gray-200 pl-3">
                          {item.subItems && item.subItems.length > 0 ? (
                            item.subItems.map((subItem, subIndex) => {
                              const isSubActive = currentCMSTab === subItem.href.split('tab=')[1];
                              return (
                                <motion.a
                                  key={subItem.name}
                                  href={subItem.href}
                                  onClick={(e) => handleSubItemClick(subItem.href, e)}
                                  className={`relative flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isSubActive
                                      ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm border-l-2 border-indigo-600'
                                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                  initial={{ x: -10, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ duration: 0.15, delay: subIndex * 0.03 }}
                                  whileHover={{ x: 2 }}
                                  whileTap={{ scale: 0.98 }}
                                  aria-current={isSubActive ? 'page' : undefined}
                                >
                                  <span className="text-base flex-shrink-0" aria-hidden="true">{subItem.icon}</span>
                                  <span className="truncate">{subItem.name}</span>
                                  {isSubActive && (
                                    <motion.div
                                      layoutId="activeIndicator"
                                      className="absolute right-2 w-2 h-2 bg-indigo-600 rounded-full shadow-sm"
                                      initial={false}
                                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                  )}
                                </motion.a>
                              );
                            })
                          ) : (
                            searchQuery && (
                              <p className="px-3 py-2 text-sm text-gray-500">No results found</p>
                            )
                          )}
                        </div>
                      </motion.div>
                    </>
                  ) : (
                    <Link
                      href={item.href || '#'}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group relative ${isActive
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <motion.div
                        className="flex items-center space-x-3 w-full"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500'}`}>
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-semibold text-sm block truncate">{item.name}</span>
                          {item.description && (
                            <p className={`text-xs mt-0.5 truncate ${isActive ? 'text-indigo-100' : 'text-gray-500'}`}>
                              {item.description}
                            </p>
                          )}
                        </div>
                        {item.badge && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`ml-auto px-2 py-0.5 text-xs font-bold rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-pink-500 text-white'
                              }`}
                          >
                            {item.badge}
                          </motion.span>
                        )}
                      </motion.div>
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-xs text-gray-600">
              <p className="font-semibold text-gray-900 mb-1">Admin Panel</p>
              <p className="text-gray-500">v2.0</p>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`pt-16 transition-all duration-300 ease-in-out ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-0'
          }`}
      >
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </motion.main>
    </div>
  );
};

export default AdminLayout;


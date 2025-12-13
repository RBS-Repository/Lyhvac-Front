"use client";

import { motion } from 'framer-motion';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import BottomNavigation from '@/components/BottomNavigation';
import Header from '@/components/Header';

export default function AccountPage() {
  const { isLoggedIn, userEmail, userName, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const recentViews = [
    { id: 1, name: "Smart Thermostat Pro", category: "Smart Controls", image: "https://as2.ftcdn.net/v2/jpg/04/02/90/75/1000_F_402907524_jRWSoHs4iY81j67WR1lUsrwqIFSRMgbw.jpg" },
    { id: 2, name: "Premium Air Purifier", category: "Air Quality", image: "https://images.pexels.com/photos/6915312/pexels-photo-6915312.jpeg" },
    { id: 3, name: "Energy-Saving AC Unit", category: "Cooling", image: "https://images.pexels.com/photos/27134985/pexels-photo-27134985.jpeg" },
  ];

  return (
    <>
      <Header />
      <BottomNavigation />
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen pb-20">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-6 md:px-12 lg:px-16 max-w-7xl py-20">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-6 text-center"
          >
            My Account
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed text-center"
          >
            Manage your profile, view your activity, and explore products
          </motion.p>
        </div>
      </motion.section>

      <main className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-16 max-w-7xl py-8 md:py-16">
        <div className="grid lg:grid-cols-4 gap-6 md:gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 sticky top-24">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-3xl font-bold">
                    {userName ? userName.charAt(0).toUpperCase() : (userEmail ? userEmail.charAt(0).toUpperCase() : 'U')}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{userName || userEmail}</h3>
                <p className="text-sm text-gray-500">Member</p>
              </div>

              <nav className="space-y-2">
                {[
                  { id: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                  { id: 'activity', label: 'Recent Activity', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                  { id: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${
                      activeTab === item.id
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    {item.label}
                  </button>
                ))}
              </nav>

              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-6 bg-red-50 text-red-600 py-3 rounded-xl font-medium hover:bg-red-100 transition-colors flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </motion.button>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Profile Information</h2>
                
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={userName || 'Not set'}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={userEmail || ''}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                      <input
                        type="text"
                        value={new Date().toLocaleDateString()}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600"
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                    <h3 className="font-semibold text-gray-900 mb-3">Member Benefits</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        View product pricing
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Access to exclusive products
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Priority customer support
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'activity' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Recent Activity</h2>
                
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800">Recently Viewed Products</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recentViews.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        className="group bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
                          <Image src={product.image} alt={product.name} fill style={{ objectFit: 'cover' }} className="group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="p-4">
                          <p className="text-xs text-blue-600 font-medium mb-1">{product.category}</p>
                          <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{product.name}</h4>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h2>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-3">Preferences</h3>
                    <div className="space-y-4">
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700">Email Notifications</span>
                        <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" defaultChecked />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700">Product Updates</span>
                        <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" defaultChecked />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700">Newsletter</span>
                        <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
                      </label>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
                  >
                    Save Settings
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
    </>
  );
}


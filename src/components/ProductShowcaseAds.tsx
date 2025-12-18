"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from './CategorySidebar';
import { useCMS } from './CMSContext';
import { API_ENDPOINTS } from '@/lib/api';

interface Product {
    _id: string;
    name: string;
    category: string;
    images: string[];
    price: number;
    rating?: number;
    badge?: string | null;
    shortDescription?: string;
    createdAt?: string;
}

const ProductShowcaseAds = () => {
    const { isOpen, isRightSidebarOpen } = useSidebar();
    const { cmsData } = useCMS();
    const [activeSlide, setActiveSlide] = useState(0);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Get showcase configuration from CMS
    const { slides, featuredProductsCount, featuredProductsFilter, ctaTitle, ctaDescription, ctaButtonPrimary, ctaButtonSecondary, ctaButtonPrimaryLink, ctaButtonSecondaryLink } = cmsData.productShowcase;

    // Fetch live products from database
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch(API_ENDPOINTS.products);
                const data = await response.json();

                let filteredProducts: Product[] = [];

                // Apply filter based on CMS settings
                switch (featuredProductsFilter) {
                    case 'recent':
                        // Sort by createdAt descending
                        filteredProducts = data.sort((a: Product, b: Product) => {
                            const dateA = new Date(a.createdAt || 0).getTime();
                            const dateB = new Date(b.createdAt || 0).getTime();
                            return dateB - dateA;
                        });
                        break;
                    case 'featured':
                        // Filter products with badges
                        filteredProducts = data.filter((p: Product) => p.badge);
                        break;
                    case 'random':
                        // Shuffle products
                        filteredProducts = [...data].sort(() => Math.random() - 0.5);
                        break;
                    default:
                        filteredProducts = data;
                }

                // Limit to the configured count
                setProducts(filteredProducts.slice(0, featuredProductsCount));
            } catch (error) {
                console.error('Failed to fetch products:', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [featuredProductsCount, featuredProductsFilter]);

    // Auto-rotate slides
    useEffect(() => {
        if (slides.length > 1) {
            const interval = setInterval(() => {
                setActiveSlide((prev) => (prev + 1) % slides.length);
            }, 7000);

            return () => clearInterval(interval);
        }
    }, [slides.length]);

    // Format price to PHP
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2
        }).format(price);
    };

    return (
        <section className={`py-16 bg-gray-50 ${isOpen ? 'md:ml-[310px]' : ''} ${isRightSidebarOpen ? 'lg:mr-[290px]' : ''} transition-all duration-300`}>
            <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-7xl">

                {/* Main Carousel Ad Section */}
                {slides.length > 0 && (
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-16 h-[500px]">
                        <AnimatePresence mode="wait">
                            {slides.map((item, index) => (
                                activeSlide === index && (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: 100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        transition={{ duration: 0.7, ease: "easeInOut" }}
                                        className="absolute inset-0"
                                    >
                                        {/* Background with gradient overlay */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient}`}>
                                            <div className="absolute inset-0 opacity-30">
                                                <Image
                                                    src={item.image}
                                                    alt={item.title}
                                                    fill
                                                    style={{ objectFit: 'cover' }}
                                                    className="mix-blend-overlay"
                                                />
                                            </div>
                                            {/* Korean-inspired dot pattern */}
                                            <div className="absolute inset-0 k-dot-pattern opacity-10"></div>
                                        </div>

                                        {/* Content */}
                                        <div className="relative h-full flex items-center">
                                            <div className="container mx-auto px-8 md:px-16">
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                                                    {/* Text content */}
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 30 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.2, duration: 0.6 }}
                                                        className="space-y-6"
                                                    >
                                                        {/* Badge */}
                                                        {item.badge && (
                                                            <div className="inline-block">
                                                                <div className={`px-4 py-2 bg-gradient-to-r ${item.accentColor} text-white text-sm font-bold rounded-full shadow-lg inline-flex items-center space-x-2`}>
                                                                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                                                    <span>{item.badge}</span>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Subtitle */}
                                                        <p className={`text-sm font-bold tracking-wider bg-gradient-to-r ${item.accentColor} bg-clip-text text-transparent uppercase`}>
                                                            {item.subtitle}
                                                        </p>

                                                        {/* Title */}
                                                        <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
                                                            {item.title}
                                                        </h2>

                                                        {/* Description */}
                                                        <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-lg">
                                                            {item.description}
                                                        </p>

                                                        {/* CTA Button */}
                                                        <div className="pt-4">
                                                            <Link
                                                                href={item.link}
                                                                className={`group inline-flex items-center space-x-3 px-8 py-4 bg-white text-gray-900 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300`}
                                                            >
                                                                <span>{item.buttonText}</span>
                                                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                                </svg>
                                                            </Link>
                                                        </div>
                                                    </motion.div>

                                                    {/* Product image showcase */}
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: 0.4, duration: 0.6 }}
                                                        className="hidden lg:block relative"
                                                    >
                                                        <div className="relative h-80 w-full">
                                                            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl">
                                                                <Image
                                                                    src={item.image}
                                                                    alt={item.title}
                                                                    fill
                                                                    style={{ objectFit: 'cover' }}
                                                                    className="rounded-2xl"
                                                                />
                                                            </div>
                                                            {/* Decorative accent line */}
                                                            <div className={`absolute -top-3 -left-3 w-24 h-24 bg-gradient-to-br ${item.accentColor} rounded-full blur-2xl opacity-50`}></div>
                                                            <div className={`absolute -bottom-3 -right-3 w-32 h-32 bg-gradient-to-tl ${item.accentColor} rounded-full blur-2xl opacity-50`}></div>
                                                        </div>
                                                    </motion.div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Korean-inspired accent lines */}
                                        <div className={`absolute top-0 left-0 w-1/3 h-1 bg-gradient-to-r ${item.accentColor}`}></div>
                                        <div className={`absolute bottom-0 right-0 w-1/3 h-1 bg-gradient-to-l ${item.accentColor}`}></div>
                                    </motion.div>
                                )
                            ))}
                        </AnimatePresence>

                        {/* Carousel indicators */}
                        {slides.length > 1 && (
                            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
                                {slides.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveSlide(index)}
                                        className={`transition-all duration-300 rounded-full ${activeSlide === index
                                                ? 'bg-white w-12 h-3'
                                                : 'bg-white/40 hover:bg-white/60 w-3 h-3'
                                            }`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Navigation arrows */}
                        {slides.length > 1 && (
                            <>
                                <button
                                    onClick={() => setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full flex items-center justify-center transition-all z-20"
                                    aria-label="Previous slide"
                                >
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full flex items-center justify-center transition-all z-20"
                                    aria-label="Next slide"
                                >
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>
                )}

                {/* Featured Products Grid */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                            <span className="block w-10 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mr-4"></span>
                            Featured Products
                        </h2>
                        <Link
                            href="/products"
                            className="text-blue-600 font-semibold flex items-center space-x-1 hover:text-blue-700 transition-colors group"
                        >
                            <span>View All</span>
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 animate-pulse">
                                    <div className="aspect-[4/3] bg-gray-200"></div>
                                    <div className="p-6 space-y-3">
                                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                        <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                                        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {products.map((product, index) => (
                                <motion.div
                                    key={product._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                >
                                    <Link
                                        href={`/products/${product._id}`}
                                        className="group block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
                                    >
                                        {/* Product image */}
                                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                                            <Image
                                                src={product.images[0] || 'https://placehold.co/600x450/e5e7eb/9ca3af?text=No+Image'}
                                                alt={product.name}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                                className="group-hover:scale-110 transition-transform duration-500"
                                            />
                                            {/* Gradient overlay on hover */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                            {/* Korean-inspired accent */}
                                            <div className="absolute top-0 left-0 w-20 h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

                                            {/* Badge */}
                                            {product.badge && (
                                                <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-full shadow-lg">
                                                    {product.badge}
                                                </div>
                                            )}
                                        </div>

                                        {/* Product info */}
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{product.category}</span>
                                                {product.rating && (
                                                    <div className="flex items-center space-x-1">
                                                        <svg className="w-4 h-4 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                        <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-1">
                                                {product.name}
                                            </h3>

                                            {/* Description */}
                                            {product.shortDescription && (
                                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                                    {product.shortDescription}
                                                </p>
                                            )}

                                            {/* Price and CTA */}
                                            <div className="flex items-center justify-between">
                                                <span className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                                                <div className="flex items-center space-x-1 text-blue-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span>View</span>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom accent line */}
                                        <div className="h-1 bg-gradient-to-r from-blue-600 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No featured products available.</p>
                        </div>
                    )}
                </div>

                {/* Call to Action Banner */}
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-xl">
                    <div className="absolute inset-0 k-grid-pattern opacity-5"></div>

                    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12 items-center">
                        <div className="space-y-6">
                            <div className="inline-block px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-full">
                                <span className="text-blue-400 font-semibold text-sm">SPECIAL OFFER</span>
                            </div>

                            <h2 className="text-3xl md:text-4xl font-black text-white">
                                {ctaTitle}
                            </h2>

                            <p className="text-gray-300 text-lg leading-relaxed">
                                {ctaDescription}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link
                                    href={ctaButtonPrimaryLink}
                                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-center hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                                >
                                    {ctaButtonPrimary}
                                </Link>
                                <Link
                                    href={ctaButtonSecondaryLink}
                                    className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-bold text-center hover:bg-white/20 transition-all duration-300"
                                >
                                    {ctaButtonSecondary}
                                </Link>
                            </div>
                        </div>

                        {/* Right side decorative element */}
                        <div className="hidden md:flex items-center justify-center relative">
                            <div className="relative w-64 h-64">
                                {/* Animated rings */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 border-4 border-blue-500/30 rounded-full"
                                ></motion.div>
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-8 border-4 border-indigo-500/30 rounded-full"
                                ></motion.div>
                                <div className="absolute inset-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl">
                                    <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top and bottom accent lines */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
                    <div className="absolute bottom-0 left-0 w-1/2 h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                </div>
            </div>
        </section>
    );
};

export default ProductShowcaseAds;

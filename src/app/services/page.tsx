"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import BottomNavigation from '@/components/BottomNavigation';
import Header from '@/components/Header';

export default function ServicesPage() {
  const services = [
    {
      title: "Installation Services",
      description: "Professional installation of all HVAC systems by certified technicians. We ensure optimal performance and longevity of your equipment.",
      icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
      features: [
        "Certified professional technicians",
        "Quality workmanship guaranteed",
        "Complete system setup",
        "Post-installation testing",
        "User training included"
      ],
      color: "blue"
    },
    {
      title: "Maintenance & Repair",
      description: "Regular maintenance and prompt repair services to keep your HVAC systems running efficiently all year round.",
      icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
      features: [
        "Preventive maintenance plans",
        "24/7 emergency repair service",
        "Diagnostic inspections",
        "Performance optimization",
        "Extended warranty options"
      ],
      color: "green"
    },
    {
      title: "System Design & Consultation",
      description: "Expert consultation and custom system design to meet your specific heating and cooling needs efficiently.",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
      features: [
        "Free initial consultation",
        "Energy efficiency analysis",
        "Custom system design",
        "Cost-benefit analysis",
        "Detailed project planning"
      ],
      color: "purple"
    },
    {
      title: "Indoor Air Quality",
      description: "Comprehensive solutions to improve your indoor air quality including purification, ventilation, and humidity control.",
      icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z",
      features: [
        "Air quality testing",
        "Air purification systems",
        "Ventilation solutions",
        "Humidity control",
        "Filter replacement services"
      ],
      color: "indigo"
    },
    {
      title: "Energy Efficiency Upgrades",
      description: "Upgrade your existing systems with the latest energy-efficient technology to reduce costs and environmental impact.",
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      features: [
        "Energy audit services",
        "Smart thermostat installation",
        "System retrofitting",
        "Insulation assessment",
        "ROI analysis"
      ],
      color: "yellow"
    },
    {
      title: "Commercial HVAC Solutions",
      description: "Specialized services for commercial properties including offices, retail spaces, and industrial facilities.",
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
      features: [
        "Large-scale system design",
        "Rooftop unit installation",
        "Building automation",
        "Scheduled maintenance",
        "Emergency service contracts"
      ],
      color: "red"
    }
  ];

  const colorClasses = {
    blue: { bg: 'from-blue-500 to-blue-600', light: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
    green: { bg: 'from-green-500 to-green-600', light: 'bg-green-50', text: 'text-green-600', border: 'border-green-100' },
    purple: { bg: 'from-purple-500 to-purple-600', light: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100' },
    indigo: { bg: 'from-indigo-500 to-indigo-600', light: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100' },
    yellow: { bg: 'from-yellow-500 to-yellow-600', light: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-100' },
    red: { bg: 'from-red-500 to-red-600', light: 'bg-red-50', text: 'text-red-600', border: 'border-red-100' },
  };

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
            Our Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed text-center"
          >
            Comprehensive HVAC solutions tailored to your needs
          </motion.p>
        </div>
      </motion.section>

      <main className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-16 max-w-7xl py-8 md:py-16">
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-20">
          {services.map((service, index) => {
            const colors = colorClasses[service.color as keyof typeof colorClasses];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
              >
                <div className={`h-2 bg-gradient-to-r ${colors.bg}`}></div>
                <div className="p-8">
                  <div className={`w-16 h-16 ${colors.light} rounded-2xl flex items-center justify-center mb-6`}>
                    <svg className={`w-8 h-8 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={service.icon} />
                    </svg>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{service.description}</p>
                  
                  <div className={`${colors.light} ${colors.border} border rounded-2xl p-6`}>
                    <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-sm text-gray-700">
                          <svg className={`w-5 h-5 ${colors.text} mr-2 flex-shrink-0 mt-0.5`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-3xl shadow-2xl p-12 text-center text-white"
        >
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Contact us today to discuss your HVAC needs and get a free consultation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg"
              >
                Contact Us
              </motion.button>
            </Link>
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors"
              >
                View Products
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Why Choose Us */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-20 bg-white rounded-3xl shadow-xl p-12 border border-gray-100"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Why Choose Us</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Expert Technicians", desc: "Certified professionals with years of experience", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
              { title: "24/7 Support", desc: "Round-the-clock customer service and emergency response", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
              { title: "Quality Guarantee", desc: "100% satisfaction guaranteed on all services", icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" },
              { title: "Competitive Pricing", desc: "Fair and transparent pricing with no hidden costs", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + idx * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
    </>
  );
}


"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavigation from '@/components/BottomNavigation';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-gray-600 text-lg">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-8 md:p-12"
          >
            <div className="prose prose-lg max-w-none">
              {/* Introduction */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Welcome to LY HVAC Systems & Parts. These Terms of Service ("Terms") govern your access to and use of 
                  our website, products, and services. By accessing or using our services, you agree to be bound by these Terms.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  If you do not agree to these Terms, please do not use our services.
                </p>
              </section>

              {/* Acceptance of Terms */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Acceptance of Terms</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  By creating an account, making a purchase, or using any of our services, you acknowledge that you have 
                  read, understood, and agree to be bound by these Terms and our Privacy Policy.
                </p>
              </section>

              {/* Products and Services */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Products and Services</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  LY HVAC offers heating, ventilation, and air conditioning systems, parts, and related services for 
                  residential and commercial use.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>We reserve the right to modify, suspend, or discontinue any product or service at any time</li>
                  <li>Product specifications and pricing are subject to change without notice</li>
                  <li>All products are subject to availability</li>
                  <li>We are not responsible for any loss or damage arising from the use of our products</li>
                </ul>
              </section>

              {/* User Accounts */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Accounts</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  To access certain features, you may need to create an account. You agree to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your information to keep it accurate</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent activity.
                </p>
              </section>

              {/* Purchases and Payment */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Purchases and Payment</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  When making a purchase:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>You agree to pay all charges incurred on your account</li>
                  <li>All prices are in Philippine Peso (PHP) unless otherwise stated</li>
                  <li>Prices are subject to change without notice</li>
                  <li>You are responsible for any applicable taxes</li>
                  <li>Refunds and returns are subject to our return policy</li>
                </ul>
              </section>

              {/* Intellectual Property */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  All content on this website, including text, graphics, logos, images, and software, is the property of 
                  LY HVAC or its licensors and is protected by copyright and trademark laws.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  You may not reproduce, distribute, modify, or create derivative works without our written permission.
                </p>
              </section>

              {/* Warranty and Disclaimers */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Warranty and Disclaimers</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Products are provided "as is" unless otherwise specified in the product warranty. We make no warranties, 
                  expressed or implied, regarding the merchantability or fitness for a particular purpose.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We are not liable for any indirect, incidental, or consequential damages arising from the use of our products.
                </p>
              </section>

              {/* Limitation of Liability */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  To the maximum extent permitted by law, LY HVAC shall not be liable for any damages arising from:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Use or inability to use our services</li>
                  <li>Unauthorized access to or alteration of your data</li>
                  <li>Any other matter relating to our services</li>
                </ul>
              </section>

              {/* Governing Law */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Governing Law</h2>
                <p className="text-gray-700 leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws of the Philippines. 
                  Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of the Philippines.
                </p>
              </section>

              {/* Changes to Terms */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to modify these Terms at any time. We will notify users of significant changes via 
                  email or by posting a notice on our website. Your continued use of our services constitutes acceptance of 
                  the modified Terms.
                </p>
              </section>

              {/* Contact Information */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have any questions about these Terms, please contact us:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 mb-2">
                    <strong>Email:</strong> info@lyhvac.com
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Phone:</strong> (555) 123-4567
                  </p>
                  <p className="text-gray-700">
                    <strong>Address:</strong> 1234 Main Street, Anytown, USA 12345
                  </p>
                </div>
              </section>
            </div>
          </motion.div>

          {/* Back to Home */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </motion.div>
        </div>
      </div>
      <BottomNavigation />
      <Footer />
    </div>
  );
};

export default TermsPage;


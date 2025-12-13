"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSidebar } from "./CategorySidebar";

const serviceItems = [
  {
    id: 1,
    title: "AC Installation & Repair",
    description: "Effortless cooling for modern living spaces.",
    image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a", // minimal AC
    slug: "/services/ac-installation",
  },

  {
    id: 3,
    title: "Air Quality Systems",
    description: "Fresh, clean air for a healthier home.",
    image: "https://images.unsplash.com/photo-1616594039964-ae1e763b4e68", // air purifier
    slug: "/services/air-quality",
  },
  {
    id: 4,
    title: "Maintenance Plans",
    description: "Routine care for lasting performance.",
    image: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6", // toolkit
    slug: "/services/maintenance",
  },
  {
    id: 5,
    title: "Emergency Services",
    description: "Quick response, day or night.",
    image: "https://images.unsplash.com/photo-1600607687920-4e5b3e1f9051", // emergency
    slug: "/services/emergency",
  },
  {
    id: 6,
    title: "Smart Home Integration",
    description: "Control comfort with a single touch.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c", // smart home
    slug: "/services/smart-home",
  },
];

const Services = () => {
  const { isOpen, isRightSidebarOpen } = useSidebar();
  
  return (
    <section
      className={`py-20 bg-[#fdfdfb] ${
        isOpen ? "md:ml-[310px]" : ""
      } ${isRightSidebarOpen ? "lg:mr-[290px]" : ""} transition-all duration-300`}
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-7xl">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h2 className="text-3xl font-light tracking-wide text-gray-800 mb-4">
            Our Services
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Tailored HVAC solutions for modern Korean homes & businesses
          </p>
        </div>

        {/* Service Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {serviceItems.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link href={service.slug}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 border border-gray-100 hover:-translate-y-1">
                  <div className="relative h-72 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      style={{ objectFit: "cover" }}
                      className="group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-2 tracking-wide">
                      {service.title}
                    </h3>
                    <p className="text-gray-500 mb-4 text-sm leading-relaxed">
                      {service.description}
                    </p>
                    <div className="flex items-center text-[#4b6584] font-medium">
                      <span>Learn more</span>
                      <svg
                        className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <Link
            href="/services"
            className="inline-block border border-[#4b6584] text-[#4b6584] px-8 py-3 rounded-full font-medium hover:bg-[#4b6584] hover:text-white transition-colors duration-500"
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;

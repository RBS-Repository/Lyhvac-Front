"use client";

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

// Define types for each component's content
export interface HeroProduct {
  id: number;
  name: string;
  category: string;
  image: string;
  imagePlaceholder: string;
  description: string;
  price?: string;
  badge?: string | null;
}

export interface HeroCategory {
  name: string;
  icon: string;
  color: string;
  textColor: string;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  featuredProducts: HeroProduct[]; // Auto-populated, not editable
  categories: HeroCategory[]; // Legacy, not used
  selectedCategories: string[]; // Array of category IDs (max 3)
}

export interface BannerSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  link: string;
  buttonText: string;
  bgColor: string;
}

export interface ProductAd {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  link: string;
  image: string;
  color: string;
  position: string;
}

export interface SpecialPromotion {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
}

export interface ProductAdsContent {
  ads: ProductAd[];
  specialPromotions: SpecialPromotion[];
}

export interface SocialChannel {
  id: number;
  name: string;
  title: string;
  description: string;
  icon: string;
  bgColor: string;
  textColor: string;
  link: string;
  buttonText: string;
}

export interface MediaReviewsContent {
  videoUrl: string;
  videoTitle: string;
  videoDescription: string;
  awardTitle: string;
  awardDescription: string;
  awardImage: string;
  socialChannels: SocialChannel[];
  customerServicePhone: string;
  customerServiceFax: string;
  customerServiceEmail: string;
  customerServiceHours: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  iconPlaceholder: string;
  color: string;
}

export interface Product {
  id: number;
  name: string;
  image: string;
  category: string;
  badge: string | null;
}

export interface CategorySelectionContent {
  title: string;
  description: string;
  categories: Category[];
  products: {
    all: Product[];
    cooling: Product[];
    heating: Product[];
    ventilation: Product[];
    'air-quality': Product[];
    'smart-controls': Product[];
    parts: Product[];
  };
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
}

export interface ContactContent {
  title: string;
  subtitle: string;
  contactInfo: ContactInfo;
}

export interface RightSidebarContent {
  customerServicePhone: string;
  customerServiceFax: string;
  customerServiceEmail: string;
  customerServiceHours: string[];
}

export interface ContactMethod {
  title: string;
  info: string;
  subInfo: string;
  color: 'blue' | 'green' | 'purple';
}

export interface OfficeLocation {
  companyName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
}

export interface AdditionalInfoItem {
  text: string;
}

export interface ContactPageContent {
  heroTitle: string;
  heroDescription: string;
  contactMethods: ContactMethod[];
  officeLocation: OfficeLocation;
  additionalInfo: AdditionalInfoItem[];
  faqTitle: string;
  faqDescription: string;
  faqButton1Text: string;
  faqButton1Link: string;
  faqButton2Text: string;
  faqButton2Link: string;
}

export interface ShowcaseSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  link: string;
  buttonText: string;
  badge?: string;
  accentColor: string;
  bgGradient: string;
  image: string;
}

export interface ProductShowcaseContent {
  slides: ShowcaseSlide[];
  featuredProductsCount: number;
  featuredProductsFilter: 'recent' | 'featured' | 'random';
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonPrimary: string;
  ctaButtonSecondary: string;
  ctaButtonPrimaryLink: string;
  ctaButtonSecondaryLink: string;
}

export interface CMSData {
  hero: HeroContent;
  bannerSlider: BannerSlide[];
  productAds: ProductAdsContent;
  productShowcase: ProductShowcaseContent;
  mediaReviews: MediaReviewsContent;
  categorySelection: CategorySelectionContent;
  contact: ContactContent;
  rightSidebar: RightSidebarContent;
  contactPage: ContactPageContent;
}

// Default CMS data
const getDefaultCMSData = (): CMSData => ({
  hero: {
    title: "Transform Your",
    subtitle: "Home Climate",
    description: "Discover innovative HVAC solutions that enhance comfort while reducing energy costs",
    featuredProducts: [
      {
        id: 1,
        name: "Smart Thermostat Pro",
        category: "Smart Controls",
        image: "/images/thermostat.jpg",
        imagePlaceholder: "https://as2.ftcdn.net/v2/jpg/04/02/90/75/1000_F_402907524_jRWSoHs4iY81j67WR1lUsrwqIFSRMgbw.jpg",
        description: "Control your home climate from anywhere",
        price: undefined,
        badge: null
      },
      {
        id: 2,
        name: "Premium Air Purifier",
        category: "Air Quality",
        image: "/images/air-purifier.jpg",
        imagePlaceholder: "https://images.pexels.com/photos/6915312/pexels-photo-6915312.jpeg",
        description: "HEPA filtration for cleaner, healthier air",
        price: undefined,
        badge: null
      },
      {
        id: 3,
        name: "Energy-Saving AC Unit",
        category: "Cooling",
        image: "/images/ac-unit.jpg",
        imagePlaceholder: "https://images.pexels.com/photos/27134985/pexels-photo-27134985.jpeg",
        description: "Efficient cooling with minimal energy use",
        price: undefined,
        badge: null
      }
    ],
    categories: [
      {
        name: "Cooling",
        icon: "❄️",
        color: "from-blue-600 to-cyan-400",
        textColor: "text-blue-600"
      },
      {
        name: "Smart Home",
        icon: "🏠",
        color: "from-purple-600 to-pink-400",
        textColor: "text-purple-600"
      },
      {
        name: "Air Quality",
        icon: "🌬️",
        color: "from-green-600 to-emerald-400",
        textColor: "text-green-600"
      }
    ],
    selectedCategories: [] // Empty by default, admin selects up to 3
  },
  bannerSlider: [
    {
      id: 1,
      title: "MK Pneumatic Valve",
      subtitle: "Top-tier technology and quality, broad selection",
      description: "Find every valve you need here — including pneumatic valves.",
      image: "https://placehold.co/1200x400/333333/FFFFFF/png?text=MK+Pneumatic+Valve",
      link: "/products/valves",
      buttonText: "MORE",
      bgColor: "bg-red-700"
    },
    {
      id: 2,
      title: "Premium Brand MK",
      subtitle: "Signature brand from Myungin Korea",
      description: "Experience our best-selling products.",
      image: "https://placehold.co/1200x400/222222/FFCC00/png?text=Premium+Brand+MK",
      link: "/products/premium",
      buttonText: "Learn More",
      bgColor: "bg-gray-900"
    },
    {
      id: 3,
      title: "Experience Zone",
      subtitle: "Request a new service",
      description: "Try MK products first and decide with confidence!",
      image: "https://placehold.co/1200x400/FF9900/FFFFFF/png?text=Service+Zone",
      link: "/services/trial",
      buttonText: "Apply",
      bgColor: "bg-orange-500"
    }
  ],
  productAds: {
    ads: [
      {
        id: 1,
        title: "Efficient Cooling Solutions",
        subtitle: "Comfort engineered for modern spaces",
        description: "Explore energy-efficient cooling systems designed for quiet, reliable performance.",
        cta: "Learn More",
        link: "/products/cooling",
        image: "https://img.freepik.com/premium-vector/ac-installation-repair-services-social-media-post-banner-instagram-post-ads-template_612040-2348.jpg",
        color: "from-blue-600 to-cyan-500",
        position: "right"
      },
      {
        id: 2,
        title: "Smart Home Integration",
        subtitle: "Control comfort with a single touch",
        description: "Connect HVAC controls with your smart home ecosystem for effortless management.",
        cta: "Explore",
        link: "/products/smart-controls",
        image: "https://i.pinimg.com/736x/1b/12/c6/1b12c6c07b193dfefba3fe4ad2ca4d0e.jpg",
        color: "from-indigo-600 to-blue-500",
        position: "left"
      },
      {
        id: 3,
        title: "Professional Installation",
        subtitle: "Certified technicians, precise setup",
        description: "Our team ensures clean installs and optimal performance for your equipment.",
        cta: "Learn More",
        link: "/services/installation",
        image: "https://placehold.co/1200x600/0f766e/FFFFFF/png?text=Professional+Installation",
        color: "from-emerald-600 to-teal-500",
        position: "right"
      }
    ],
    specialPromotions: [
      {
        id: 1,
        title: "Energy Star Products",
        description: "Discover energy-efficient solutions for long-term savings",
        image: "https://pbs.twimg.com/media/Fj61w5QaEAAw7tw.jpg",
        link: "/products/energy-efficient"
      },
      {
        id: 2,
        title: "Seasonal Maintenance",
        description: "Keep systems running smoothly all year round",
        image: "https://img.freepik.com/premium-vector/ac-installation-repair-services-social-media-post-banner-instagram-post-ads-template_612040-2348.jpg?w=360",
        link: "/services/maintenance"
      }
    ]
  },
  mediaReviews: {
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    videoTitle: "Company Overview (Korean)",
    videoDescription: "Fast delivery service, local direct shipping",
    awardTitle: "Excellence in HVAC and Piping",
    awardDescription: "Korea Consumer Satisfaction Index — 1st Place, two years running",
    awardImage: "https://placehold.co/200x200/FFD700/000000/png?text=Award",
    socialChannels: [
      {
        id: 1,
        name: "YouTube",
        title: "Specialized HVAC media channel",
        description: "Subscribe to the channel",
        icon: "🎬",
        bgColor: "bg-red-600",
        textColor: "text-white",
        link: "https://youtube.com",
        buttonText: "Subscribe"
      },
      {
        id: 2,
        name: "Facebook",
        title: "Official Facebook channel",
        description: "Follow us",
        icon: "👍",
        bgColor: "bg-blue-600",
        textColor: "text-white",
        link: "https://facebook.com",
        buttonText: "Follow"
      },
      {
        id: 3,
        name: "Instagram",
        title: "Official Instagram channel",
        description: "Follow us",
        icon: "📸",
        bgColor: "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500",
        textColor: "text-white",
        link: "https://instagram.com",
        buttonText: "Follow"
      }
    ],
    customerServicePhone: "031-366-5433",
    customerServiceFax: "031-366-5435",
    customerServiceEmail: "mk@mymk.co.kr",
    customerServiceHours: "Weekdays 9:00 ~ 18:00 | Lunch 12:00 ~ 13:00"
  },
  categorySelection: {
    title: "Browse Our Products",
    description: "Discover LY HVAC's premium heating, ventilation, and air conditioning systems and parts",
    categories: [
      {
        id: 'all',
        name: 'All Products',
        icon: '/icons/all.svg',
        iconPlaceholder: '🔍',
        color: 'from-gray-700 to-gray-900'
      },
      {
        id: 'cooling',
        name: 'Cooling Systems',
        icon: '/icons/cooling.svg',
        iconPlaceholder: '❄️',
        color: 'from-blue-600 to-blue-800'
      },
      {
        id: 'heating',
        name: 'Heating Systems',
        icon: '/icons/heating.svg',
        iconPlaceholder: '🔥',
        color: 'from-red-600 to-red-800'
      },
      {
        id: 'ventilation',
        name: 'Ventilation',
        icon: '/icons/ventilation.svg',
        iconPlaceholder: '💨',
        color: 'from-green-600 to-green-800'
      },
      {
        id: 'air-quality',
        name: 'Air Quality',
        icon: '/icons/air-quality.svg',
        iconPlaceholder: '🌬️',
        color: 'from-purple-600 to-purple-800'
      },
      {
        id: 'smart-controls',
        name: 'Smart Controls',
        icon: '/icons/smart.svg',
        iconPlaceholder: '🏠',
        color: 'from-indigo-600 to-indigo-800'
      },
      {
        id: 'parts',
        name: 'Parts & Accessories',
        icon: '/icons/parts.svg',
        iconPlaceholder: '🔧',
        color: 'from-amber-600 to-amber-800'
      }
    ],
    products: {
      all: [
        {
          id: 1,
          name: 'Premium Air Conditioner',
          image: 'https://as1.ftcdn.net/v2/jpg/04/83/93/52/1000_F_483935256_UepJRLrSwB8LtlyMQSUINAc4hILddlcF.jpg',
          category: 'cooling',
          badge: null
        },
        {
          id: 2,
          name: 'Smart Thermostat Pro',
          image: 'https://payload.cargocollective.com/1/2/84904/14483325/Pro_Fall_Promo_2023_FullPage_Ad_Jul-14_2550-1_1340_c.jpg',
          category: 'smart-controls',
          badge: null
        },
        {
          id: 3,
          name: 'HEPA Air Purifier',
          image: 'https://crane-philippines.com/wp-content/uploads/2020/08/EE-5272_-New-Look-Smart-Air-Purifier-7.jpg',
          category: 'air-quality',
          badge: null
        },
        {
          id: 4,
          name: 'Energy-Efficient Heater',
          image: 'https://m.media-amazon.com/images/I/81FDvzRvojL._UF1000,1000_QL80_.jpg',
          category: 'heating',
          badge: null
        }
      ],
      cooling: [
        {
          id: 1,
          name: 'Premium Air Conditioner',
          image: 'https://as1.ftcdn.net/v2/jpg/04/83/93/52/1000_F_483935256_UepJRLrSwB8LtlyMQSUINAc4hILddlcF.jpg',
          category: 'cooling',
          badge: null
        },
        {
          id: 5,
          name: 'Portable AC Unit',
          image: 'https://i.pinimg.com/736x/5a/c1/16/5ac116159d9d4f850075580a65eb97bf.jpg',
          category: 'cooling',
          badge: null
        },
        {
          id: 6,
          name: 'Ceiling Fan Deluxe',
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGgfQvIulpAuVRZqogSEBbdfR2KPJz80C-QA&s',
          category: 'cooling',
          badge: null
        },
        {
          id: 7,
          name: 'Window AC Unit',
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyxpleENQgk5UtsuN-awyfu7mlZ0RI9nPVJw&s',
          category: 'cooling',
          badge: null
        }
      ],
      heating: [
        {
          id: 4,
          name: 'Energy-Efficient Heater',
          image: 'https://m.media-amazon.com/images/I/81FDvzRvojL._UF1000,1000_QL80_.jpg',
          category: 'heating',
          badge: null
        },
        {
          id: 8,
          name: 'Floor Heating System',
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoArBEAUKN6j-p3SMJdP0brKJtzFZShCQqCg&s',
          category: 'heating',
          badge: null
        },
        {
          id: 9,
          name: 'Portable Heater',
          image: 'https://m.media-amazon.com/images/I/81geRUSwnvL._AC_SL1500_.jpg',
          category: 'heating',
          badge: null
        },
        {
          id: 10,
          name: 'Central Heating Unit',
          image: 'https://i.pinimg.com/564x/a5/21/ea/a521ea63e4976a05e7a6a4981beeec0d.jpg',
          category: 'heating',
          badge: null
        }
      ],
      ventilation: [
        {
          id: 11,
          name: 'Whole House Fan',
          image: 'https://cdn11.bigcommerce.com/s-v30rg9y3yr/images/stencil/500x659/products/188/549/Solatube_Whole_House_Fan_EPS__34479__59991.1698938548.PNG?c=1',
          category: 'ventilation',
          badge: null
        },
        {
          id: 12,
          name: 'Air Exchanger',
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOCyREDzUuICEZJYKQxFKOWFygDk5CIOVr_Q&s',
          category: 'ventilation',
          badge: null
        },
        {
          id: 13,
          name: 'Bathroom Exhaust Fan',
          image: 'https://img.lazcdn.com/g/p/21e530431e848273d6bb12b025d3c0f0.jpg_720x720q80.jpg',
          category: 'ventilation',
          badge: null
        },
        {
          id: 14,
          name: 'Attic Ventilator',
          image: 'https://placehold.co/300x300/22c55e/FFFFFF/png?text=Attic+Ventilator',
          category: 'ventilation',
          badge: null
        }
      ],
      'air-quality': [
        {
          id: 3,
          name: 'HEPA Air Purifier',
          image: 'https://crane-philippines.com/wp-content/uploads/2020/08/EE-5272_-New-Look-Smart-Air-Purifier-7.jpg',
          category: 'air-quality',
          badge: null
        },
        {
          id: 15,
          name: 'Dehumidifier Pro',
          image: 'https://placehold.co/300x300/6d28d9/FFFFFF/png?text=Dehumidifier',
          category: 'air-quality',
          badge: null
        },
        {
          id: 16,
          name: 'Humidifier System',
          image: 'https://placehold.co/300x300/7c3aed/FFFFFF/png?text=Humidifier',
          category: 'air-quality',
          badge: null
        },
        {
          id: 17,
          name: 'UV Air Sanitizer',
          image: 'https://placehold.co/300x300/4c1d95/FFFFFF/png?text=UV+Sanitizer',
          category: 'air-quality',
          badge: null
        }
      ],
      'smart-controls': [
        {
          id: 2,
          name: 'Smart Thermostat Pro',
          image: 'https://payload.cargocollective.com/1/2/84904/14483325/Pro_Fall_Promo_2023_FullPage_Ad_Jul-14_2550-1_1340_c.jpg',
          category: 'smart-controls',
          badge: null
        },
        {
          id: 18,
          name: 'HVAC Control Hub',
          image: 'https://placehold.co/300x300/1e40af/FFFFFF/png?text=Control+Hub',
          category: 'smart-controls',
          badge: null
        },
        {
          id: 19,
          name: 'Smart Vent System',
          image: 'https://placehold.co/300x300/2563eb/FFFFFF/png?text=Smart+Vent',
          category: 'smart-controls',
          badge: null
        },
        {
          id: 20,
          name: 'Climate Sensor Pack',
          image: 'https://placehold.co/300x300/3b82f6/FFFFFF/png?text=Climate+Sensors',
          category: 'smart-controls',
          badge: null
        }
      ],
      parts: [
        {
          id: 21,
          name: 'HVAC Filter Pack',
          image: 'https://placehold.co/300x300/b45309/FFFFFF/png?text=Filter+Pack',
          category: 'parts',
          badge: null
        },
        {
          id: 22,
          name: 'AC Refrigerant',
          image: 'https://placehold.co/300x300/d97706/FFFFFF/png?text=Refrigerant',
          category: 'parts',
          badge: null
        },
        {
          id: 23,
          name: 'Fan Motor',
          image: 'https://placehold.co/300x300/f59e0b/FFFFFF/png?text=Fan+Motor',
          category: 'parts',
          badge: null
        },
        {
          id: 24,
          name: 'Thermostat Wiring Kit',
          image: 'https://placehold.co/300x300/fbbf24/FFFFFF/png?text=Wiring+Kit',
          category: 'parts',
          badge: null
        }
      ]
    }
  },
  contact: {
    title: "Contact Us",
    subtitle: "Have questions about our products or services? We're here to help.",
    contactInfo: {
      phone: "(555) 123-4567",
      email: "info@hvacpro.com",
      address: "1234 Main Street\nAnytown, USA 12345"
    }
  },
  rightSidebar: {
    customerServicePhone: "031-366-5433",
    customerServiceFax: "031-366-5435",
    customerServiceEmail: "mk@mymk.co.kr",
    customerServiceHours: [
      "Weekdays 9:00 ~ 18:00",
      "Lunchtime 12:00 ~ 13:00",
      "Closed on weekends and public holidays"
    ]
  },
  contactPage: {
    heroTitle: "Contact Us",
    heroDescription: "Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
    contactMethods: [
      {
        title: "Call Us",
        info: "031-366-5433",
        subInfo: "FAX: 031-366-5435",
        color: "blue"
      },
      {
        title: "Email Us",
        info: "mk@mymk.co.kr",
        subInfo: "We reply within 24 hours",
        color: "green"
      },
      {
        title: "Business Hours",
        info: "Monday - Friday",
        subInfo: "9:00 AM - 6:00 PM",
        color: "purple"
      }
    ],
    officeLocation: {
      companyName: "LY HVAC Systems & Parts",
      addressLine1: "1234 Main Street",
      addressLine2: "Suite 100",
      city: "City, State 12345"
    },
    additionalInfo: [
      { text: "Free consultation available" },
      { text: "Emergency service available 24/7" },
      { text: "Parking available on-site" },
      { text: "Wheelchair accessible" }
    ],
    faqTitle: "Have Questions?",
    faqDescription: "Check out our FAQ section or customer service page for quick answers",
    faqButton1Text: "Customer Service",
    faqButton1Link: "/customer-service",
    faqButton2Text: "About Us",
    faqButton2Link: "/about"
  },
  productShowcase: {
    slides: [
      {
        id: 1,
        title: "Smart Climate Control",
        subtitle: "INTELLIGENT HVAC SYSTEMS",
        description: "Experience next-generation climate control with AI-powered efficiency and seamless automation.",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070",
        link: "/products/smart-controls",
        buttonText: "DISCOVER",
        badge: "NEW",
        accentColor: "from-blue-600 to-indigo-600",
        bgGradient: "from-blue-900 via-indigo-900 to-purple-900"
      },
      {
        id: 2,
        title: "Energy Saving Solutions",
        subtitle: "ECO-FRIENDLY TECHNOLOGY",
        description: "Reduce your energy costs by up to 40% with our premium eco-friendly HVAC solutions.",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069",
        link: "/products/cooling",
        buttonText: "LEARN MORE",
        badge: "SAVE 40%",
        accentColor: "from-green-600 to-emerald-600",
        bgGradient: "from-emerald-900 via-teal-900 to-cyan-900"
      },
      {
        id: 3,
        title: "Premium Comfort Series",
        subtitle: "LUXURY MEETS PERFORMANCE",
        description: "Whisper-quiet operation, superior air quality, and unmatched reliability for your home.",
        image: "https://images.unsplash.com/photo-1545259742-24e768f6c041?q=80&w=2070",
        link: "/products/heating",
        buttonText: "EXPLORE",
        badge: "PREMIUM",
        accentColor: "from-purple-600 to-pink-600",
        bgGradient: "from-purple-900 via-fuchsia-900 to-pink-900"
      }
    ],
    featuredProductsCount: 3,
    featuredProductsFilter: 'recent',
    ctaTitle: "Need Expert Advice on Your HVAC System?",
    ctaDescription: "Book a free consultation with our HVAC specialists and get personalized recommendations for your home or business.",
    ctaButtonPrimary: "Get Free Consultation",
    ctaButtonSecondary: "Browse Products",
    ctaButtonPrimaryLink: "/contact",
    ctaButtonSecondaryLink: "/products"
  }
});

interface CMSContextValue {
  cmsData: CMSData;
  updateHeroContent: (content: HeroContent) => void;
  updateBannerSlider: (banners: BannerSlide[]) => void;
  updateProductAds: (content: ProductAdsContent) => void;
  updateProductShowcase: (content: ProductShowcaseContent) => void;
  updateMediaReviews: (content: MediaReviewsContent) => void;
  updateCategorySelection: (content: CategorySelectionContent) => void;
  updateContact: (content: ContactContent) => void;
  updateRightSidebar: (content: RightSidebarContent) => void;
  updateContactPage: (content: ContactPageContent) => void;
  resetToDefaults: () => void;
}

const CMSContext = createContext<CMSContextValue | undefined>(undefined);

export const CMSProvider = ({ children }: { children: ReactNode }) => {
  const [cmsData, setCmsData] = useState<CMSData>(getDefaultCMSData());
  const [isInitialized, setIsInitialized] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = window.localStorage.getItem("cmsData");
        if (stored) {
          const parsed = JSON.parse(stored);
          const defaultData = getDefaultCMSData();

          // Merge with defaults to ensure all fields exist (handles data migration)
          const migratedData: CMSData = {
            hero: {
              ...defaultData.hero,
              ...parsed.hero,
              selectedCategories: parsed.hero?.selectedCategories || defaultData.hero.selectedCategories,
            },
            // If stored bannerSlider is missing or empty, fall back to defaults so the admin dashboard always shows slides
            bannerSlider: parsed.bannerSlider && parsed.bannerSlider.length > 0
              ? parsed.bannerSlider
              : defaultData.bannerSlider,
            productAds: parsed.productAds || defaultData.productAds,
            productShowcase: parsed.productShowcase || defaultData.productShowcase,
            mediaReviews: parsed.mediaReviews || defaultData.mediaReviews,
            categorySelection: parsed.categorySelection || defaultData.categorySelection,
            contact: parsed.contact || defaultData.contact,
            rightSidebar: parsed.rightSidebar || defaultData.rightSidebar,
            contactPage: parsed.contactPage || defaultData.contactPage,
          };

          setCmsData(migratedData);
        }
        setIsInitialized(true);
      }
    } catch (error) {
      console.error("Error loading CMS data:", error);
      setIsInitialized(true);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      try {
        if (typeof window !== "undefined") {
          window.localStorage.setItem("cmsData", JSON.stringify(cmsData));
        }
      } catch (error) {
        console.error("Error saving CMS data:", error);
      }
    }
  }, [cmsData, isInitialized]);

  const value = useMemo<CMSContextValue>(() => ({
    cmsData,
    updateHeroContent: (content: HeroContent) => {
      setCmsData(prev => ({ ...prev, hero: content }));
    },
    updateBannerSlider: (banners: BannerSlide[]) => {
      setCmsData(prev => ({ ...prev, bannerSlider: banners }));
    },
    updateProductAds: (content: ProductAdsContent) => {
      setCmsData(prev => ({ ...prev, productAds: content }));
    },
    updateProductShowcase: (content: ProductShowcaseContent) => {
      setCmsData(prev => ({ ...prev, productShowcase: content }));
    },
    updateMediaReviews: (content: MediaReviewsContent) => {
      setCmsData(prev => ({ ...prev, mediaReviews: content }));
    },
    updateCategorySelection: (content: CategorySelectionContent) => {
      setCmsData(prev => ({ ...prev, categorySelection: content }));
    },
    updateContact: (content: ContactContent) => {
      setCmsData(prev => ({ ...prev, contact: content }));
    },
    updateRightSidebar: (content: RightSidebarContent) => {
      setCmsData(prev => ({ ...prev, rightSidebar: content }));
    },
    updateContactPage: (content: ContactPageContent) => {
      setCmsData(prev => ({ ...prev, contactPage: content }));
    },
    resetToDefaults: () => {
      setCmsData(getDefaultCMSData());
    }
  }), [cmsData]);

  return <CMSContext.Provider value={value}>{children}</CMSContext.Provider>;
};

export const useCMS = () => {
  const ctx = useContext(CMSContext);
  if (!ctx) throw new Error("useCMS must be used within CMSProvider");
  return ctx;
};


"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCMS } from '@/components/CMSContext';
import type { HeroContent, BannerSlide, ProductAdsContent, MediaReviewsContent, CategorySelectionContent, ContactContent, RightSidebarContent, ContactPageContent } from '@/components/CMSContext';
import ProductManagementCMS from '@/components/ProductManagementCMS';
import CategoryManagement from '@/components/CategoryManagement';
import AdminLayout from '@/components/AdminLayout';
import { Card } from '@/components/admin/Card';
import { FormInput, FormTextarea, FormSelect, FormButton } from '@/components/admin/FormInput';
import { motion } from 'framer-motion';
import { API_ENDPOINTS } from '@/lib/api';

type TabType = 'hero' | 'banner' | 'ads' | 'media' | 'categories' | 'products' | 'category-management' | 'contact' | 'contact-page' | 'sidebar';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
}

export default function CMSAdminPage() {
  const { cmsData, updateHeroContent, updateBannerSlider, updateProductAds, updateMediaReviews, updateCategorySelection, updateContact, updateRightSidebar, updateContactPage, resetToDefaults } = useCMS();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const tab = searchParams.get('tab') as TabType;
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Fetch categories for hero section dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.categories);
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const showSuccess = () => {
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleHeroSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Get selected categories (max 3), remove duplicates
    const selectedCategories: string[] = [];
    const seen = new Set<string>();
    for (let i = 0; i < 3; i++) {
      const categoryId = formData.get(`category-${i}`) as string;
      if (categoryId && categoryId !== '' && !seen.has(categoryId)) {
        selectedCategories.push(categoryId);
        seen.add(categoryId);
      }
    }
    
    const updatedHero: HeroContent = {
      title: formData.get('hero-title') as string,
      subtitle: formData.get('hero-subtitle') as string,
      description: formData.get('hero-description') as string,
      featuredProducts: cmsData.hero.featuredProducts, // Keep existing, auto-populated
      categories: cmsData.hero.categories, // Keep for backward compatibility
      selectedCategories: selectedCategories.slice(0, 3) // Max 3 categories, no duplicates
    };
    
    updateHeroContent(updatedHero);
    showSuccess();
  };

  const handleBannerSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const updatedBanners: BannerSlide[] = cmsData.bannerSlider.map((banner, index) => ({
      ...banner,
      title: formData.get(`banner-${index}-title`) as string,
      subtitle: formData.get(`banner-${index}-subtitle`) as string,
      description: formData.get(`banner-${index}-description`) as string,
      image: formData.get(`banner-${index}-image`) as string,
      link: formData.get(`banner-${index}-link`) as string,
      buttonText: formData.get(`banner-${index}-buttonText`) as string,
    }));
    
    updateBannerSlider(updatedBanners);
    showSuccess();
  };

  const handleProductAdsSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const updatedAds: ProductAdsContent = {
      ads: cmsData.productAds.ads.map((ad, index) => ({
        ...ad,
        title: formData.get(`ad-${index}-title`) as string,
        subtitle: formData.get(`ad-${index}-subtitle`) as string,
        description: formData.get(`ad-${index}-description`) as string,
        cta: formData.get(`ad-${index}-cta`) as string,
        link: formData.get(`ad-${index}-link`) as string,
        image: formData.get(`ad-${index}-image`) as string,
      })),
      specialPromotions: cmsData.productAds.specialPromotions.map((promo, index) => ({
        ...promo,
        title: formData.get(`promo-${index}-title`) as string,
        description: formData.get(`promo-${index}-description`) as string,
        image: formData.get(`promo-${index}-image`) as string,
        link: formData.get(`promo-${index}-link`) as string,
      }))
    };
    
    updateProductAds(updatedAds);
    showSuccess();
  };

  const handleMediaReviewsSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const updatedMedia: MediaReviewsContent = {
      videoUrl: formData.get('video-url') as string,
      videoTitle: formData.get('video-title') as string,
      videoDescription: formData.get('video-description') as string,
      awardTitle: formData.get('award-title') as string,
      awardDescription: formData.get('award-description') as string,
      awardImage: formData.get('award-image') as string,
      socialChannels: cmsData.mediaReviews.socialChannels.map((channel, index) => ({
        ...channel,
        title: formData.get(`social-${index}-title`) as string,
        description: formData.get(`social-${index}-description`) as string,
        icon: formData.get(`social-${index}-icon`) as string,
      })),
      customerServicePhone: formData.get('service-phone') as string,
      customerServiceFax: formData.get('service-fax') as string,
      customerServiceEmail: formData.get('service-email') as string,
      customerServiceHours: formData.get('service-hours') as string,
    };
    
    updateMediaReviews(updatedMedia);
    showSuccess();
  };

  const handleCategorySelectionSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const updatedCategories: CategorySelectionContent = {
      title: formData.get('section-title') as string,
      description: formData.get('section-description') as string,
      categories: cmsData.categorySelection.categories.map((category, index) => ({
        ...category,
        name: formData.get(`category-${index}-name`) as string,
        icon: formData.get(`category-${index}-icon`) as string,
      })),
      products: cmsData.categorySelection.products
    };
    
    updateCategorySelection(updatedCategories);
    showSuccess();
  };

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateContact({
      title: formData.get('title') as string,
      subtitle: formData.get('subtitle') as string,
      contactInfo: {
        phone: formData.get('phone') as string,
        email: formData.get('email') as string,
        address: formData.get('address') as string,
      }
    });
    showSuccess();
  };

  const handleSidebarSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const hours = (formData.get('hours') as string).split('\n').filter(h => h.trim());
    updateRightSidebar({
      customerServicePhone: formData.get('phone') as string,
      customerServiceFax: formData.get('fax') as string,
      customerServiceEmail: formData.get('email') as string,
      customerServiceHours: hours
    });
    showSuccess();
  };

  const handleContactPageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const contactMethods = cmsData.contactPage.contactMethods.map((method, index) => ({
      ...method,
      title: formData.get(`method-${index}-title`) as string,
      info: formData.get(`method-${index}-info`) as string,
      subInfo: formData.get(`method-${index}-subInfo`) as string,
      color: formData.get(`method-${index}-color`) as 'blue' | 'green' | 'purple',
    }));

    const additionalInfo = cmsData.contactPage.additionalInfo.map((item, index) => ({
      text: formData.get(`info-${index}`) as string,
    }));

    const updatedContactPage: ContactPageContent = {
      heroTitle: formData.get('heroTitle') as string,
      heroDescription: formData.get('heroDescription') as string,
      contactMethods,
      officeLocation: {
        companyName: formData.get('companyName') as string,
        addressLine1: formData.get('addressLine1') as string,
        addressLine2: formData.get('addressLine2') as string,
        city: formData.get('city') as string,
      },
      additionalInfo,
      faqTitle: formData.get('faqTitle') as string,
      faqDescription: formData.get('faqDescription') as string,
      faqButton1Text: formData.get('faqButton1Text') as string,
      faqButton1Link: formData.get('faqButton1Link') as string,
      faqButton2Text: formData.get('faqButton2Text') as string,
      faqButton2Link: formData.get('faqButton2Link') as string,
    };
    
    updateContactPage(updatedContactPage);
    showSuccess();
  };

  const tabTitles: Record<TabType, { title: string; description: string; icon: string }> = {
    hero: { title: 'Hero Section', description: 'Edit the main hero section on your homepage', icon: '🎯' },
    banner: { title: 'Banner Slider', description: 'Manage the rotating banner slides', icon: '🎨' },
    ads: { title: 'Product Advertisements', description: 'Manage featured product ads', icon: '📢' },
    media: { title: 'Media & Reviews', description: 'Manage video content, awards, and testimonials', icon: '⭐' },
    categories: { title: 'Category Selection', description: 'Manage the category selection section', icon: '🏷️' },
    products: { title: 'Product Management', description: 'Manage all products', icon: '📦' },
    'category-management': { title: 'Category Management', description: 'Create and edit categories', icon: '🗂️' },
    contact: { title: 'Contact Section (Homepage)', description: 'Manage contact information on homepage', icon: '📧' },
    'contact-page': { title: 'Contact Page', description: 'Manage the full contact page content', icon: '📄' },
    sidebar: { title: 'Right Sidebar', description: 'Manage customer service information', icon: '📞' },
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as TabType);
  };

  return (
    <AdminLayout onCMSTabChange={handleTabChange} currentCMSTab={activeTab}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            {tabTitles[activeTab].icon} {tabTitles[activeTab].title}
          </h1>
          <p className="text-gray-600 text-lg">{tabTitles[activeTab].description}</p>
        </motion.div>

        {/* Success Message */}
        {showSuccessMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-20 right-6 z-50"
          >
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3">
              <motion.svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </motion.svg>
              <span className="font-semibold">Changes saved successfully!</span>
            </div>
          </motion.div>
        )}

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Hero Section Tab */}
          {activeTab === 'hero' && (
            <Card
              title="Hero Section Content"
              description="Edit the main hero section on your homepage"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              }
            >
              <form onSubmit={handleHeroSubmit} className="space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Text Content</h3>
                  
                  <FormInput
                    label="Main Title"
                    name="hero-title"
                    defaultValue={cmsData.hero.title}
                    required
                    placeholder="Enter the main headline"
                  />

                  <FormInput
                    label="Subtitle"
                    name="hero-subtitle"
                    defaultValue={cmsData.hero.subtitle}
                    required
                    placeholder="Enter a catchy subtitle"
                  />

                  <FormTextarea
                    label="Description"
                    name="hero-description"
                    defaultValue={cmsData.hero.description}
                    rows={4}
                    required
                    placeholder="Enter a brief description"
                    helpText="This text appears below the subtitle"
                  />
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Select Categories to Display</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Choose up to 3 categories to display in the hero section. Products will be automatically populated from these categories.
                    </p>
                    
                    {loadingCategories ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        <span className="ml-3 text-gray-600">Loading categories...</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[0, 1, 2].map((index) => {
                          // Get currently selected categories in other dropdowns
                          const otherSelected = cmsData.hero.selectedCategories.filter((_, i) => i !== index);
                          
                          return (
                            <div key={index} className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Category {index + 1} {index === 0 && <span className="text-red-500">*</span>}
                              </label>
                              <FormSelect
                                name={`category-${index}`}
                                defaultValue={cmsData.hero.selectedCategories[index] || ''}
                                required={index === 0}
                                onChange={(e) => {
                                  // Optional: Add client-side validation to prevent duplicates
                                  // This is handled server-side in handleHeroSubmit, but good UX to show it
                                }}
                              >
                                <option value="">-- Select Category --</option>
                                {categories.map((category) => {
                                  const isSelectedElsewhere = otherSelected.includes(category._id);
                                  const isCurrentSelection = cmsData.hero.selectedCategories[index] === category._id;
                                  
                                  return (
                                    <option 
                                      key={category._id} 
                                      value={category._id}
                                      disabled={isSelectedElsewhere && !isCurrentSelection}
                                    >
                                      {category.name} {isSelectedElsewhere && !isCurrentSelection ? '(Already selected)' : ''}
                                    </option>
                                  );
                                })}
                              </FormSelect>
                              {index > 0 && (
                                <p className="text-xs text-gray-500">
                                  Optional - Select a different category
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                    
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> Products shown in the hero section will be automatically fetched from the selected categories. 
                        You can manage products in the <strong>Products</strong> section.
                      </p>
                    </div>
                  </div>
                </div>

                <FormButton type="submit" className="w-full">
                  💾 Save Hero Content
                </FormButton>
              </form>
            </Card>
          )}

          {/* Banner Slider Tab */}
          {activeTab === 'banner' && (
            <Card
              title="Banner Slider Content"
              description="Manage the rotating banner slides"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
            >
              <form onSubmit={handleBannerSubmit} className="space-y-8">
                {cmsData.bannerSlider.map((banner, index) => (
                  <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border-2 border-gray-200 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">Banner Slide {index + 1}</h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        ID: {banner.id}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormInput
                        label="Title"
                        name={`banner-${index}-title`}
                        defaultValue={banner.title}
                        required
                      />
                      <FormInput
                        label="Subtitle"
                        name={`banner-${index}-subtitle`}
                        defaultValue={banner.subtitle}
                        required
                      />
                    </div>

                    <FormTextarea
                      label="Description"
                      name={`banner-${index}-description`}
                      defaultValue={banner.description}
                      rows={3}
                      required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormInput
                        label="Image URL"
                        name={`banner-${index}-image`}
                        defaultValue={banner.image}
                        required
                      />
                      <FormInput
                        label="Link URL"
                        name={`banner-${index}-link`}
                        defaultValue={banner.link}
                        required
                        type="url"
                      />
                    </div>

                    <FormInput
                      label="Button Text"
                      name={`banner-${index}-buttonText`}
                      defaultValue={banner.buttonText}
                      required
                    />
                  </div>
                ))}

                <FormButton type="submit" className="w-full">
                  💾 Save Banner Slides
                </FormButton>
              </form>
            </Card>
          )}

          {/* Product Ads Tab */}
          {activeTab === 'ads' && (
            <div className="space-y-6">
              <Card
                title="Product Advertisements"
                description="Manage featured product ads"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                }
              >
                <form onSubmit={handleProductAdsSubmit} className="space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Main Ads</h3>
                    <div className="space-y-6">
                      {cmsData.productAds.ads.map((ad, index) => (
                        <div key={index} className="bg-gray-50 p-6 rounded-xl space-y-4">
                          <h4 className="font-semibold text-gray-900">Ad {index + 1}</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput
                              label="Title"
                              name={`ad-${index}-title`}
                              defaultValue={ad.title}
                              required
                            />
                            <FormInput
                              label="Subtitle"
                              name={`ad-${index}-subtitle`}
                              defaultValue={ad.subtitle}
                              required
                            />
                          </div>

                          <FormTextarea
                            label="Description"
                            name={`ad-${index}-description`}
                            defaultValue={ad.description}
                            rows={3}
                            required
                          />

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormInput
                              label="Call-to-Action"
                              name={`ad-${index}-cta`}
                              defaultValue={ad.cta}
                              required
                            />
                            <FormInput
                              label="Link URL"
                              name={`ad-${index}-link`}
                              defaultValue={ad.link}
                              required
                              type="url"
                            />
                            <FormInput
                              label="Image URL"
                              name={`ad-${index}-image`}
                              defaultValue={ad.image}
                              required
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Special Promotions</h3>
                    <div className="space-y-6">
                      {cmsData.productAds.specialPromotions.map((promo, index) => (
                        <div key={index} className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl space-y-4">
                          <h4 className="font-semibold text-gray-900">Promotion {index + 1}</h4>
                          
                          <FormInput
                            label="Title"
                            name={`promo-${index}-title`}
                            defaultValue={promo.title}
                            required
                          />

                          <FormTextarea
                            label="Description"
                            name={`promo-${index}-description`}
                            defaultValue={promo.description}
                            rows={3}
                            required
                          />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput
                              label="Image URL"
                              name={`promo-${index}-image`}
                              defaultValue={promo.image}
                              required
                            />
                            <FormInput
                              label="Link URL"
                              name={`promo-${index}-link`}
                              defaultValue={promo.link}
                              required
                              type="url"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <FormButton type="submit" className="w-full">
                    💾 Save Product Ads
                  </FormButton>
                </form>
              </Card>
            </div>
          )}

          {/* Media & Reviews Tab */}
          {activeTab === 'media' && (
            <Card
              title="Media & Reviews"
              description="Manage video content, awards, and testimonials"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            >
              <form onSubmit={handleMediaReviewsSubmit} className="space-y-8">
                {/* Video Section */}
                <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Video Content</h3>
                  <FormInput
                    label="Video URL"
                    name="video-url"
                    defaultValue={cmsData.mediaReviews.videoUrl}
                    required
                    type="url"
                    helpText="Enter YouTube or video URL"
                  />
                  <FormInput
                    label="Video Title"
                    name="video-title"
                    defaultValue={cmsData.mediaReviews.videoTitle}
                    required
                  />
                  <FormTextarea
                    label="Video Description"
                    name="video-description"
                    defaultValue={cmsData.mediaReviews.videoDescription}
                    rows={3}
                    required
                  />
                </div>

                {/* Award Section */}
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-xl space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Award Information</h3>
                  <FormInput
                    label="Award Title"
                    name="award-title"
                    defaultValue={cmsData.mediaReviews.awardTitle}
                    required
                  />
                  <FormTextarea
                    label="Award Description"
                    name="award-description"
                    defaultValue={cmsData.mediaReviews.awardDescription}
                    rows={3}
                    required
                  />
                  <FormInput
                    label="Award Image URL"
                    name="award-image"
                    defaultValue={cmsData.mediaReviews.awardImage}
                    required
                  />
                </div>

                {/* Social Channels */}
                <div className="bg-blue-50 p-6 rounded-xl space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Social Media Channels</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cmsData.mediaReviews.socialChannels.map((channel, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg space-y-3">
                        <h4 className="font-semibold text-gray-900">{channel.name}</h4>
                        <FormInput
                          label="Title"
                          name={`social-${index}-title`}
                          defaultValue={channel.title}
                          required
                        />
                        <FormTextarea
                          label="Description"
                          name={`social-${index}-description`}
                          defaultValue={channel.description}
                          rows={2}
                          required
                        />
                        <FormInput
                          label="Icon (emoji or class)"
                          name={`social-${index}-icon`}
                          defaultValue={channel.icon}
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Service Info */}
                <div className="bg-purple-50 p-6 rounded-xl space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Service Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="Service Phone"
                      name="service-phone"
                      defaultValue={cmsData.mediaReviews.customerServicePhone}
                      required
                    />
                    <FormInput
                      label="Service Fax"
                      name="service-fax"
                      defaultValue={cmsData.mediaReviews.customerServiceFax}
                      required
                    />
                  </div>
                  <FormInput
                    label="Service Email"
                    name="service-email"
                    type="email"
                    defaultValue={cmsData.mediaReviews.customerServiceEmail}
                    required
                  />
                  <FormTextarea
                    label="Service Hours"
                    name="service-hours"
                    defaultValue={cmsData.mediaReviews.customerServiceHours}
                    rows={3}
                    required
                  />
                </div>

                <FormButton type="submit" className="w-full">
                  💾 Save Media & Reviews
                </FormButton>
              </form>
            </Card>
          )}

          {/* Category Selection Tab */}
          {activeTab === 'categories' && (
            <Card
              title="Category Selection Section"
              description="Manage the category selection section content"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              }
            >
              <form onSubmit={handleCategorySelectionSubmit} className="space-y-6">
                <FormInput
                  label="Section Title"
                  name="section-title"
                  defaultValue={cmsData.categorySelection.title}
                  required
                />

                <FormTextarea
                  label="Section Description"
                  name="section-description"
                  defaultValue={cmsData.categorySelection.description}
                  rows={2}
                  required
                />

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cmsData.categorySelection.categories.map((category, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-xl space-y-4">
                        <h4 className="font-semibold text-gray-900">Category {index + 1}</h4>
                        <FormInput
                          label="Name"
                          name={`category-${index}-name`}
                          defaultValue={category.name}
                          required
                        />
                        <FormInput
                          label="Icon (emoji or class)"
                          name={`category-${index}-icon`}
                          defaultValue={category.icon}
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <FormButton type="submit" className="w-full">
                  💾 Save Category Selection
                </FormButton>
              </form>
            </Card>
          )}

          {/* Contact Page Tab */}
          {activeTab === 'contact' && (
            <Card
              title="Contact Page Content"
              description="Manage contact information and details"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            >
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <FormInput
                  label="Page Title"
                  name="title"
                  defaultValue={cmsData.contact.title}
                  required
                  placeholder="e.g., Contact Us"
                />

                <FormTextarea
                  label="Subtitle"
                  name="subtitle"
                  defaultValue={cmsData.contact.subtitle}
                  rows={2}
                  required
                  placeholder="Enter a welcoming subtitle"
                />

                <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
                  
                  <FormInput
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    defaultValue={cmsData.contact.contactInfo.phone}
                    required
                    helpText="Include country code if international"
                  />

                  <FormInput
                    label="Email Address"
                    name="email"
                    type="email"
                    defaultValue={cmsData.contact.contactInfo.email}
                    required
                  />

                  <FormTextarea
                    label="Physical Address"
                    name="address"
                    defaultValue={cmsData.contact.contactInfo.address}
                    rows={3}
                    required
                    helpText="Enter the full address (use line breaks for formatting)"
                  />
                </div>

                <FormButton type="submit" className="w-full">
                  💾 Save Contact Information
                </FormButton>
              </form>
            </Card>
          )}

          {/* Right Sidebar Tab */}
          {activeTab === 'sidebar' && (
            <Card
              title="Right Sidebar Content"
              description="Manage customer service information"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              }
            >
              <form onSubmit={handleSidebarSubmit} className="space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Service Details</h3>
                  
                  <FormInput
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    defaultValue={cmsData.rightSidebar.customerServicePhone}
                    required
                  />

                  <FormInput
                    label="Fax Number"
                    name="fax"
                    type="tel"
                    defaultValue={cmsData.rightSidebar.customerServiceFax}
                    required
                  />

                  <FormInput
                    label="Email Address"
                    name="email"
                    type="email"
                    defaultValue={cmsData.rightSidebar.customerServiceEmail}
                    required
                  />

                  <FormTextarea
                    label="Service Hours"
                    name="hours"
                    defaultValue={cmsData.rightSidebar.customerServiceHours.join('\n')}
                    rows={4}
                    required
                    helpText="Enter each time slot on a new line"
                  />
                </div>

                <FormButton type="submit" className="w-full">
                  💾 Save Sidebar Information
                </FormButton>
              </form>
            </Card>
          )}

          {/* Contact Page Tab */}
          {activeTab === 'contact-page' && (
            <Card
              title="Contact Page Content"
              description="Manage all content on the contact page"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            >
              <form onSubmit={handleContactPageSubmit} className="space-y-8">
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Hero Section</h3>
                  
                  <FormInput
                    label="Page Title"
                    name="heroTitle"
                    defaultValue={cmsData.contactPage.heroTitle}
                    required
                  />

                  <FormTextarea
                    label="Hero Description"
                    name="heroDescription"
                    defaultValue={cmsData.contactPage.heroDescription}
                    rows={3}
                    required
                  />
                </div>

                {/* Contact Methods */}
                <div className="bg-gray-50 p-6 rounded-xl space-y-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Methods</h3>
                  {cmsData.contactPage.contactMethods.map((method, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
                      <h4 className="font-semibold text-gray-900">Contact Method {index + 1}</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                          label="Title"
                          name={`method-${index}-title`}
                          defaultValue={method.title}
                          required
                        />
                        <FormInput
                          label="Info"
                          name={`method-${index}-info`}
                          defaultValue={method.info}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                          label="Sub Info"
                          name={`method-${index}-subInfo`}
                          defaultValue={method.subInfo}
                          required
                        />
                        <FormSelect
                          label="Color"
                          name={`method-${index}-color`}
                          defaultValue={method.color}
                          required
                        >
                          <option value="blue">Blue</option>
                          <option value="green">Green</option>
                          <option value="purple">Purple</option>
                        </FormSelect>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Office Location */}
                <div className="bg-green-50 p-6 rounded-xl space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Office Location</h3>
                  
                  <FormInput
                    label="Company Name"
                    name="companyName"
                    defaultValue={cmsData.contactPage.officeLocation.companyName}
                    required
                  />

                  <FormInput
                    label="Address Line 1"
                    name="addressLine1"
                    defaultValue={cmsData.contactPage.officeLocation.addressLine1}
                    required
                  />

                  <FormInput
                    label="Address Line 2"
                    name="addressLine2"
                    defaultValue={cmsData.contactPage.officeLocation.addressLine2}
                    required
                  />

                  <FormInput
                    label="City, State ZIP"
                    name="city"
                    defaultValue={cmsData.contactPage.officeLocation.city}
                    required
                  />
                </div>

                {/* Additional Info */}
                <div className="bg-purple-50 p-6 rounded-xl space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Additional Information</h3>
                  {cmsData.contactPage.additionalInfo.map((item, index) => (
                    <FormInput
                      key={index}
                      label={`Info Item ${index + 1}`}
                      name={`info-${index}`}
                      defaultValue={item.text}
                      required
                    />
                  ))}
                </div>

                {/* FAQ Section */}
                <div className="bg-yellow-50 p-6 rounded-xl space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">FAQ Section</h3>
                  
                  <FormInput
                    label="FAQ Title"
                    name="faqTitle"
                    defaultValue={cmsData.contactPage.faqTitle}
                    required
                  />

                  <FormTextarea
                    label="FAQ Description"
                    name="faqDescription"
                    defaultValue={cmsData.contactPage.faqDescription}
                    rows={2}
                    required
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="Button 1 Text"
                      name="faqButton1Text"
                      defaultValue={cmsData.contactPage.faqButton1Text}
                      required
                    />
                    <FormInput
                      label="Button 1 Link"
                      name="faqButton1Link"
                      defaultValue={cmsData.contactPage.faqButton1Link}
                      required
                      type="url"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="Button 2 Text"
                      name="faqButton2Text"
                      defaultValue={cmsData.contactPage.faqButton2Text}
                      required
                    />
                    <FormInput
                      label="Button 2 Link"
                      name="faqButton2Link"
                      defaultValue={cmsData.contactPage.faqButton2Link}
                      required
                      type="url"
                    />
                  </div>
                </div>

                <FormButton type="submit" className="w-full">
                  💾 Save Contact Page Content
                </FormButton>
              </form>
            </Card>
          )}

          {/* Product Management Tab */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <ProductManagementCMS />
              </div>
            </div>
          )}

          {/* Category Management Tab */}
          {activeTab === 'category-management' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <CategoryManagement />
              </div>
            </div>
          )}
        </div>

        {/* Reset to Defaults Button */}
        <div className="mt-8 pb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Danger Zone</h3>
                <p className="text-sm text-gray-600 mt-1">Reset all content to default values</p>
              </div>
              <FormButton
                variant="danger"
                onClick={() => {
                  if (window.confirm('Are you sure you want to reset all content to defaults? This action cannot be undone.')) {
                    resetToDefaults();
                    showSuccess();
                  }
                }}
              >
                🔄 Reset to Defaults
              </FormButton>
            </div>
          </Card>
        </div>
      </motion.div>
    </AdminLayout>
  );
}

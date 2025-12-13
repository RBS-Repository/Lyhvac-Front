"use client";

import Image from 'next/image';
import { useSidebar } from './CategorySidebar';
import { useCMS } from './CMSContext';

const MediaReviews = () => {
  const { isOpen, isRightSidebarOpen } = useSidebar();
  const { cmsData } = useCMS(); // Get CMS data
  
  // Get data from CMS
  const {
    videoUrl,
    videoTitle,
    videoDescription,
    awardTitle,
    awardDescription,
    awardImage,
    socialChannels,
    customerServicePhone,
    customerServiceFax,
    customerServiceEmail,
    customerServiceHours
  } = cmsData.mediaReviews;

  // Convert YouTube watch URLs to embed format
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // If already an embed URL, return as is
    if (url.includes('/embed/')) return url;
    
    // Extract video ID from various YouTube URL formats
    let videoId = '';
    
    // Handle: https://www.youtube.com/watch?v=VIDEO_ID
    const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (watchMatch) videoId = watchMatch[1];
    
    // Handle: https://youtu.be/VIDEO_ID
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (shortMatch) videoId = shortMatch[1];
    
    // Handle: https://www.youtube.com/embed/VIDEO_ID (already embed)
    const embedMatch = url.match(/\/embed\/([a-zA-Z0-9_-]+)/);
    if (embedMatch) videoId = embedMatch[1];
    
    // If we found a video ID, return embed URL with necessary parameters
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}`;
    }
    
    // Return original URL if no match
    return url;
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <section className={`py-16 bg-white ${isOpen ? 'md:ml-[310px]' : ''} ${isRightSidebarOpen ? 'lg:mr-[290px]' : ''} transition-all duration-300`}>
      <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-7xl">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-2">Media & Reviews</h2>
          <p className="text-gray-600">Check out various product reviews and information.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video Section */}
          <div className="lg:col-span-2 bg-gray-100 rounded-lg overflow-hidden">
            <div className="relative pb-[56.25%] h-0">
              <iframe 
                className="absolute top-0 left-0 w-full h-full"
                src={embedUrl} 
                title="Product Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-4 bg-gray-900 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">{videoTitle}</h3>
                  <p className="text-sm text-gray-300">{videoDescription}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 rounded-full bg-gray-800 text-white">
                    <span className="sr-only">Play</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button className="p-2 rounded-full bg-gray-800 text-white">
                    <span className="sr-only">Share</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-400">
                <span>2:03 / 3:58</span>
              </div>
            </div>
          </div>
          
          {/* Social Media Channels */}
          <div className="space-y-4">
            {socialChannels.map((channel) => (
              <a 
                key={channel.id}
                href={channel.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`block ${channel.bgColor} ${channel.textColor} rounded-lg overflow-hidden hover:opacity-90 transition-opacity`}
              >
                <div className="p-6 flex items-center">
                  <div className="flex-1">
                    <div className="text-2xl mb-1">{channel.title}</div>
                    <div className="text-lg font-medium">{channel.buttonText}</div>
                  </div>
                  <div className="text-4xl">{channel.icon}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
        
        {/* Award Banner */}
        <div className="mt-12">
          <div className="relative bg-gray-900 rounded-lg overflow-hidden">
            <div className="p-8 md:p-12 flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-8">
                  <Image
                    src={awardImage}
                    alt="Award Medal"
                    width={100}
                    height={100}
                    className="rounded-full"
                  />
                </div>
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2">{awardTitle}</h3>
                  <p className="text-xl">{awardDescription}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Menu - Similar to the image */}
        <div className="mt-12 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium">Quick Menu</h3>
          </div>
          <div className="grid grid-cols-3 gap-4 p-4">
            <a href="#" className="flex flex-col items-center justify-center p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span className="text-sm text-gray-700">Product Explorer</span>
            </a>
            <a href="#" className="flex flex-col items-center justify-center p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="text-sm text-gray-700">Product Catalog</span>
            </a>
            <a href="#" className="flex flex-col items-center justify-center p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span className="text-sm text-gray-700">Recently viewed</span>
            </a>
            <a href="#" className="flex flex-col items-center justify-center p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-sm text-gray-700">Resources</span>
            </a>
            <a href="#" className="flex flex-col items-center justify-center p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className="text-sm text-gray-700">Customer support</span>
            </a>
            <a href="#" className="flex flex-col items-center justify-center p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              </div>
              <span className="text-sm text-gray-700">Project tracking</span>
            </a>
          </div>
        </div>
        
      
        {/* Customer Service Center */}
        <div className="mt-12 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium">Customer Service Center</h3>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <p className="text-xl font-bold text-amber-500">{customerServicePhone}</p>
              <p className="text-sm text-gray-600">FAX {customerServiceFax}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{customerServiceHours}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{customerServiceEmail}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MediaReviews; 
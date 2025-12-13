"use client";

import Link from 'next/link';


const BottomNavigation = () => {
  // Navigation items based on the Korean website image
  const navItems = [
    { 
      id: 1, 
      icon: "🏠", 
      iconPath: "/icons/home.svg",
      name: "Home", 
      englishName: "Home",
      path: "/" 
    },
    { 
      id: 2, 
      icon: "📦", 
      iconPath: "/icons/catalog.svg",
      name: "Catalog", 
      englishName: "Catalog",
      path: "/products" 
    },
  
  ];

  // Button data for the center buttons
  const buttons = [
    {
      id: 2,
      name: "Showcase Mode",
      englishName: "Showcase Mode",
      path: "/products",
      bgColor: "bg-blue-500"
    }
  ];

  return (
    <>
      {/* Desktop Bottom Navigation - only visible on md and larger screens */}
      <div className="hidden md:block fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-7xl">
          <div className="grid grid-cols-5 h-16">
            {/* Left navigation items */}
            <div className="col-span-1 flex items-center justify-start space-x-6">
              {navItems.slice(0, 1).map((item) => (
                <Link 
                  key={item.id}
                  href={item.path}
                  className="flex items-center justify-center text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <span className="text-2xl mr-1">{item.icon}</span>
                  <span className="text-sm">{item.englishName}</span>
                </Link>
              ))}
            </div>
            
            {/* Center buttons */}
            <div className="col-span-3 flex items-center justify-center space-x-4">
              {buttons.map((button) => (
                <Link
                  key={button.id}
                  href={button.path}
                  className={`${button.bgColor} text-white px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition-opacity flex-1 text-center`}
                >
                  {button.englishName}
                </Link>
              ))}
            </div>
            
            {/* Right navigation items */}
            <div className="col-span-1 flex items-center justify-end space-x-6">
              {navItems.slice(1).map((item) => (
                <Link 
                  key={item.id}
                  href={item.path}
                  className="flex items-center justify-center text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <span className="text-2xl mr-1">{item.icon}</span>
                  <span className="text-sm">{item.englishName}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Bottom Navigation - only visible on smaller screens */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200">
        <div className="grid grid-cols-3 h-16">
          {navItems.map((item) => (
            <Link 
              key={item.id}
              href={item.path}
              className="flex flex-col items-center justify-center text-gray-700 hover:text-blue-600 transition-colors"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs mt-1">{item.englishName}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default BottomNavigation; 

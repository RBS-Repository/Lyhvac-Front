import Header from '../components/Header';
import Hero from '../components/Hero';
import CategorySidebar from '../components/CategorySidebar';
import RightSidebar from '../components/RightSidebar';
import BottomNavigation from '../components/BottomNavigation';
import KoreanBannerSlider from '../components/KoreanBannerSlider';
import KoreanProductBanner from '../components/KoreanProductBanner';
import ProductShowcaseAds from '../components/ProductShowcaseAds';
import CategorySelection from '../components/CategorySelection';
import ProductAds from '../components/ProductAds';
import Services from '../components/Services';
import Testimonials from '../components/Testimonials';
import MediaReviews from '../components/MediaReviews';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <CategorySidebar />
      <RightSidebar />

      <main className="">
        <Hero />

        <ProductShowcaseAds />
        <CategorySelection />
        <ProductAds />

        <MediaReviews />
        <Contact />


      </main>
      <BottomNavigation />
      <Footer />
    </div>
  );
}

import HeroSection from '../components/home/HeroSection';
import CategoryGrid from '../components/home/CategoryGrid';
import FeaturedSection from '../components/home/FeaturedSection';
import TopBuilders from '../components/home/TopBuilders';
import TestimonialsSection from '../components/home/TestimonialsSection';
import ArticlesSection from '../components/home/ArticlesSection';

export default function HomePage() {
  return (
    <div className="bg-white">
      <HeroSection />
      <CategoryGrid />

      <FeaturedSection
        title="Upcoming New Launches"
        subtitle="Newly launched residential projects"
        category="property_sell"
        viewAllPath="/listings?category=property_sell"
      />

      <FeaturedSection
        title="Recently Launched Projects"
        subtitle="Fresh listings just added"
        category="property_sell"
        viewAllPath="/listings?category=property_sell"
        bgGray
      />

      <FeaturedSection
        title="Top Selling Recommended Projects"
        subtitle="Projects in high demand"
        category="property_sell"
        viewAllPath="/listings?category=property_sell"
      />

      <FeaturedSection
        title="Properties for Rent"
        subtitle="Houses, Apartments, PG & Commercial"
        category="property_rent"
        viewAllPath="/listings?category=property_rent"
        bgGray
      />

      <FeaturedSection
        title="Furniture Deals"
        subtitle="Living Room • Bedroom • Kitchen & Dining"
        category="furniture"
        viewAllPath="/listings?category=furniture"
      />

      <FeaturedSection
        title="Top Home Services Near You"
        subtitle="Interior Design • Plumbing • Painting • Cleaning"
        category="services"
        viewAllPath="/listings?category=services"
        bgGray
      />

      <FeaturedSection
        title="Building Materials"
        subtitle="Cement • Steel • Tiles • Paints"
        category="materials"
        viewAllPath="/listings?category=materials"
      />

      <TopBuilders />
      <TestimonialsSection />
      <ArticlesSection />
    </div>
  );
}

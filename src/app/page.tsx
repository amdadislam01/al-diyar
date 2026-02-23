import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import BrandMarquee from "@/components/home/BrandMarquee";
import TrustSection from "@/components/home/TrustSection";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import PopularCities from "@/components/home/PopularCities";
import FeaturedListing from "@/components/home/FeaturedListing";
import ClientsTestimonials from "@/components/home/ClientsTestimonials";
import TopAgents from "@/components/home/TopAgents";
import FooterCTA from "@/components/home/FooterCTA";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <Navbar />
      <main className="grow">
        <Hero />
        <PopularCities />
        <FeaturedProperties />
        <TrustSection />
        <BrandMarquee />
        <FeaturedListing />
        <ClientsTestimonials />
        <TopAgents />
        <FooterCTA />
      </main>
      <Footer />
    </div>
  );
}

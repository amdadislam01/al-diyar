import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import MapPreview from "@/components/home/MapPreview";
import HowItWorks from "@/components/home/HowItWorks";
import TopAgents from "@/components/home/TopAgents";
import FooterCTA from "@/components/home/FooterCTA";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark">
      <Navbar />
      <main className="grow">
        <Hero />
        <FeaturedProperties />
        <MapPreview />
        <HowItWorks />
        <TopAgents />
        <FooterCTA />
      </main>
      <Footer />
    </div>
  );
}

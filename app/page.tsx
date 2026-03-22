import Navbar from "@/components/navbar";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import HowItWorks from "@/components/landing/how-it-works";
import Stats from "@/components/landing/stats";
import Testimonials from "@/components/landing/testimonals";
import FAQ from "@/components/landing/faq";
import CTA from "@/components/landing/cta";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Stats />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

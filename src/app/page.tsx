import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Metrics from "@/components/landing/Metrics";
import Features from "@/components/landing/Features";
import Models from "@/components/landing/Models";
import GettingStarted from "@/components/landing/GettingStarted";
import Partners from "@/components/landing/Partners";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Models />
      <Metrics />
      <Features />
      <GettingStarted />
      <Partners />
      <CTA />
      <Footer />
    </main>
  );
}

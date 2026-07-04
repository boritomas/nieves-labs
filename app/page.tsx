import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Benefits from '@/components/Benefits';
import Integration from '@/components/Integration';
import Testimonials from '@/components/Testimonials';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="overflow-hidden">
      <Header />
      <Hero />
      <Features />
      <Benefits />
      <Integration />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}

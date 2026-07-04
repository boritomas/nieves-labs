import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProductShowcase from '@/components/ProductShowcase';
import WorkflowSection from '@/components/WorkflowSection';
import RoadmapSection from '@/components/RoadmapSection';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Nieves Labs - Practical AI Products',
  description: 'Build intelligent applications with AI-powered products and automation tools.',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Header />
      <Hero />
      <ProductShowcase />
      <WorkflowSection />
      <RoadmapSection />
      <CTA />
      <Footer />
    </main>
  );
}
import { HeroSection } from "@/components/landing/HeroSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { CTASection } from "@/components/landing/CTASection";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Stats & Social Proof Logos */}
      <StatsSection />

      {/* 3. Features Section (6 Core Features) */}
      <FeaturesSection />

      {/* 4. How It Works (3-Step Process) */}
      <HowItWorksSection />

      {/* 5. Testimonial & Trust Statements */}
      <TestimonialsSection />

      {/* 6. Transparent SaaS Pricing Comparison */}
      <PricingSection />

      {/* 7. Final Call to Action Section */}
      <CTASection />
    </div>
  );
}

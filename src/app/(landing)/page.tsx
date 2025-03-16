import { LandingTestimonials } from "./_components/LandingTestimonials";
import { LandingPricing } from "./_components/LandingPricing";
import { LandingFAQ } from "./_components/LandingFAQ";
import { faqItems } from "../_domain/faq";
import { LandingCta } from "./_components/LandingCta";
import { LandingFooter } from "./_components/LandingFooter";
import { LandingFeatures } from "./_components/LandingFeatures";
import { LandingHero } from "./_components/LandingHero";
import { LandingNavbar } from "./_components/LandingNavbar";
import { navItems } from "../_domain/nav-items";

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <LandingNavbar navItems={navItems} />
      <LandingHero />
      <LandingFeatures />
      <LandingTestimonials />
      <LandingPricing />
      <LandingFAQ items={faqItems} />
      <LandingCta />
      <LandingFooter />
    </div>
  );
}

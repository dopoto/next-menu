import { faqItems } from '../_domain/faq';
import { navItems } from '../_domain/nav-items';
import { LandingCta } from './_components/LandingCta';
import { LandingFAQ } from './_components/LandingFAQ';
import { LandingFeatures } from './_components/LandingFeatures';
import { LandingFooter } from './_components/LandingFooter';
import { LandingHero } from './_components/LandingHero';
import { LandingNavbar } from './_components/LandingNavbar';
import { LandingPricing } from './_components/LandingPricing';
import { LandingTestimonials } from './_components/LandingTestimonials';

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

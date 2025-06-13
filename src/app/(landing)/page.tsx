import { LandingComparePriceTiers } from '~/app/(landing)/_components/LandingComparePriceTiers';
import { LandingCta } from '~/app/(landing)/_components/LandingCta';
import { LandingFAQ } from '~/app/(landing)/_components/LandingFAQ';
import { LandingFeatures } from '~/app/(landing)/_components/LandingFeatures';
import { LandingFooter } from '~/app/(landing)/_components/LandingFooter';
import { LandingHero } from '~/app/(landing)/_components/LandingHero';
import { LandingNavbar } from '~/app/(landing)/_components/LandingNavbar';
import { LandingPricing } from '~/app/(landing)/_components/LandingPricing';
import { LandingTestimonials } from '~/app/(landing)/_components/LandingTestimonials';
import { LandingUseCases } from '~/app/(landing)/_components/LandingUseCases';
import { faqItems } from '~/domain/faq';
import { landingPageNavItems } from '~/domain/nav-items';

export default async function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            <LandingNavbar navItems={landingPageNavItems} />
            <LandingHero />
            <LandingFeatures />
            {/* <LandingTestimonials /> */}
            {/* <LandingUseCases /> */}
            <LandingPricing />
            <LandingComparePriceTiers />
            <LandingFAQ items={faqItems} />
            <LandingCta />
            <LandingFooter />
        </div>
    );
}

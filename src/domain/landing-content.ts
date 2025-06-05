type SectionHeader = {
    label: string;
    title: string;
    secondary: string;
};
type Section = {
    id: string;
    header: SectionHeader;
};

export const sections: Record<string, Section> = {
    features: {
        id: 'features',
        header: {
            label: 'Features',
            title: 'A better way to work',
            secondary: 'The tools you need for your restaurant, bar or pub',
        },
    },
    testimonials: {
        id: 'testimonials',
        header: {
            label: 'Testimonials',
            title: 'Trusted by businesses worldwide',
            secondary: "Don't just take our word for it — hear what our customers have to say.",
        },
    },
    pricing: {
        id: 'pricing',
        header: {
            label: 'Pricing',
            title: 'Plans for any business size',
            secondary: 'No strings attached. Upgrade, downgrade or cancel instantly, anytime.',
        },
    },
    compare: {
        id: 'compare',
        header: {
            label: 'Compare plans',
            title: 'What fits you best?',
            secondary: 'A detailed feature matrix of our price tiers',
        },
    },
    faqs: {
        id: 'faqs',
        header: {
            label: 'FAQ',
            title: 'Frequently asked questions',
            secondary: ' Find answers to common questions about our platform.',
        },
    },
};

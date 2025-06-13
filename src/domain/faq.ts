export interface FAQItem {
    question: string;
    answer: string;
}

export const faqItems: FAQItem[] = [
    {
        question: 'Can I change my plan later?',
        answer: 'Absolutely. You can upgrade, downgrade, or cancel your plan at any time. If you upgrade, the new features will be instantly available. If you downgrade, the changes will take effect at the start of your next billing cycle.',
    },
    {
        question: 'Is there a setup fee?',
        answer: 'No, there are no setup fees for any of our plans. You only pay the advertised monthly subscription fee based on the plan you choose.',
    },
    {
        question: 'How secure is my data?',
        answer: 'We take security very seriously. All data is encrypted at rest and in transit using industry-standard encryption. We also offer two-factor authentication, single sign-on, and role-based access controls to ensure your data remains secure.',
    },
    {
        question: 'Do you offer refunds?',
        answer: 'We offer a 30-day money-back guarantee for all new subscriptions. If you are not satisfied with our service within the first 30 days, contact our support team for a full refund.',
    },
];

import { Airplay, ChartPieIcon, Clock, PiggyBankIcon, ScanQrCode, Utensils } from 'lucide-react';
import React from 'react';
import { LandingSectionTitle } from '~/app/(landing)/_components/LandingSectionTitle';
import { sections } from '~/domain/landing-content';

export interface Feature {
    title: string;
    description: string;
    icon: React.ReactNode;
}

export const LandingFeatures: React.FC = () => {
    const features: Feature[] = [
        {
            title: `Your own site - on us`,
            description: `Once you set up your menus, you get a public link that hosts them - always online, ready to be shared, no web hosting required.`,
            icon: <ScanQrCode className="text-pop h-6 w-6" />,
        },
        {
            title: 'Always in sync',
            description: `Publish updates to your menu items and prices any time - they're instantly reflected in your menus.`,
            icon: <Utensils className="text-pop h-6 w-6" />,
        },
        {
            title: 'No app required',
            description:
                'Customers that scan your QR codes are taken to your public menu page, that simply works on any mobile device.',
            icon: <Airplay className="text-pop h-6 w-6" />,
        },
        {
            title: 'Fully-automated ordering system',
            description: `In interactive mode, guests can order items directly from your menu and can see instant updates for items marked as received at the table by your staff.`,
            icon: <Clock className="text-pop h-6 w-6" />,
        },
        {
            title: 'No hidden costs',
            description:
                'No purchases of expensive terminals or app installs are required. Your guests and your staff only need a device with a browser - be it a phone, a tablet, a laptop or a desktop PC.',
            icon: <PiggyBankIcon className="text-pop h-6 w-6" />,
        },
        {
            title: 'In-depth reports',
            description: `How many guests opened your menus? What's your best selling menu item? What is never ordered? Easy - learn all these and much more from our reports page, included in all price plans!`,
            icon: <ChartPieIcon className="text-pop h-6 w-6" />,
        },
    ];

    const { label, title, secondary } = sections.features!.header;

    return (
        <div className="bg-background py-16" id="features">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <LandingSectionTitle label={label} title={title} secondary={secondary} />
                <div className="mt-16">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-card relative flex flex-col rounded-xl p-6 shadow-sm transition-shadow duration-300 hover:shadow-md"
                            >
                                <div className="bg-secondary mb-4 flex h-12 w-12 items-center justify-center rounded-md">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-medium">{feature.title}</h3>
                                <p className="mt-2 text-base">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

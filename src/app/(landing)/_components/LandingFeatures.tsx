import { Airplay, Clock, Globe, ScanQrCode, Users, Utensils } from 'lucide-react';
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
            title: 'Step into the QR age',
            description: 'Create and manage QR-powered menus for your customers',
            icon: <ScanQrCode className="text-pop h-6 w-6" />,
        },
        {
            title: 'Handle take-out orders with ease',
            description: 'Nunc eget tincidunt libero. Pellentesque fringilla congue nisi id lobortis.',
            icon: <Utensils className="text-pop h-6 w-6" />,
        },
        {
            title: 'Set up and manage kiosk screens',
            description: 'Mauris turpis lectus, finibus eget gravida a, sollicitudin sit amet risus.',
            icon: <Airplay className="text-pop h-6 w-6" />,
        },
        {
            title: 'See open orders in real time, anytime',
            description: 'Donec ac lobortis enim, id pellentesque massa. Nulla quis enim ut elit consequat malesuada.',
            icon: <Clock className="text-pop h-6 w-6" />,
        },
        {
            title: 'Team Collaboration',
            description: 'Quisque tincidunt aliquam malesuada. Maecenas maximus purus ac metus congue viverra. ',
            icon: <Users className="text-pop h-6 w-6" />,
        },
        {
            title: 'Global Accessibility',
            description:
                'Suspendisse tincidunt diam non risus venenatis, ac efficitur velit sodales. Aenean blandit consequat elit in pellentesque.',
            icon: <Globe className="text-pop h-6 w-6" />,
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

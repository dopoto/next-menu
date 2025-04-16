import React from 'react';
import { Card } from '~/components/ui/card';
import { sections } from '../../_domain/landing-content';
import { LandingSectionTitle } from './LandingSectionTitle';

interface Testimonial {
    content: string;
    author: string;
    role: string;
    company: string;
}

const testimonials: Testimonial[] = [
    {
        content:
            'Aliquam a quam rhoncus, vestibulum arcu at, tristique nisi. Proin porttitor luctus erat id maximus. Suspendisse tincidunt nec nisl eu pulvinar.',
        author: 'Sarah Johnson',
        role: 'CTO',
        company: 'TechNova',
    },
    {
        content:
            'Curabitur et fringilla metus. Aenean vitae eros congue, convallis nisi cursus, fringilla nunc. Curabitur tristique purus cursus, fringilla turpis a, maximus justo.',
        author: 'Michael Chen',
        role: 'Product Manager',
        company: 'Flexibyte',
    },
    {
        content:
            'Ut tristique vitae mi quis venenatis. Nulla eu blandit nunc, eget ullamcorper nibh. Nam fermentum nec lacus a dictum.',
        author: 'Emily Rodriguez',
        role: 'Operations Director',
        company: 'Greystone Inc',
    },
];
const { label, title, secondary } = sections.testimonials!.header;

export const LandingTestimonials: React.FC = () => {
    return (
        <div
            className="scroll-mt-[100px] bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 py-16 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950"
            id="testimonials"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <LandingSectionTitle label={label} title={title} secondary={secondary} />
                <div className="mt-16 grid gap-8 md:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="bg-card flex h-full flex-col rounded-xl p-6 shadow-sm">
                            <div className="flex-grow">
                                <p className="text-gray-600 italic">&quot;{testimonial.content}&quot;</p>
                            </div>
                            <div className="mt-6 flex items-center">
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {testimonial.author}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {testimonial.role}, {testimonial.company}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

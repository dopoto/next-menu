'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { LandingSectionTitle } from '~/app/(landing)/_components/LandingSectionTitle';
import { FAQItem } from '~/domain/faq';
import { sections } from '~/domain/landing-content';

export function LandingFAQ(props: { items: FAQItem[] }) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleItem = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };
    const { label, title, secondary } = sections.faqs!.header;
    return (
        <div className="bg-background py-16" id="faq">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <LandingSectionTitle label={label} title={title} secondary={secondary} />
                <div className="mx-auto mt-12 max-w-3xl divide-y">
                    {props.items.map((item, index) => (
                        <div key={index} className="py-6">
                            <button
                                onClick={() => toggleItem(index)}
                                className="flex w-full items-center justify-between text-left"
                            >
                                <h3 className="text-lg font-medium">{item.question}</h3>
                                {openIndex === index ? (
                                    <ChevronUp className="h-5 w-5" />
                                ) : (
                                    <ChevronDown className="h-5 w-5" />
                                )}
                            </button>
                            {openIndex === index && (
                                <div className="mt-2 pr-12">
                                    <p className="text-base text-gray-500">{item.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

import React from 'react';
import { LandingSectionTitle } from '~/app/(landing)/_components/LandingSectionTitle';
import { sections } from '~/domain/landing-content';

const { label, title, secondary } = sections.usecases!.header;

// TODO

export const LandingUseCases: React.FC = () => {
    return (
        <div
            className="scroll-mt-[100px] bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 py-16 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950"
            id="usecases"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <LandingSectionTitle label={label} title={title} secondary={secondary} />
                <div className="mt-16 grid gap-8 md:grid-cols-3">
                    interactive tab |
                    non-interactive tab
                </div>
            </div>
        </div>
    );
};

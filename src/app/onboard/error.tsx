'use client'; // Error boundaries must be Client Components

import { SplitScreenContainer } from '~/app/_components/SplitScreenContainer';
import { type PublicError } from '~/domain/error-handling';
import { ErrorCard } from '../_components/ErrorCard';

export default function OnboardError({ error, reset }: { error: PublicError; reset: () => void }) {
    return (
        <SplitScreenContainer
            title={`Onboarding`}
            subtitle="Sorry, could not complete this operation..."
            mainComponent={<ErrorCard publicErrorMessage={error.digest} errorDigest={error.digest} onReset={reset} />}
        />
    );
}

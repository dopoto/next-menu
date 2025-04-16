'use client';

import { SplitScreenContainer } from '~/app/_components/SplitScreenContainer';

interface LoadingProps {
    progress: number;
}

export default function ProcessingPlanChange({ progress }: LoadingProps) {
    return (
        <SplitScreenContainer
            title="Processing your plan change"
            subtitle="This should be done in a sec..."
            mainComponent={
                <div className="w-full space-y-4">
                    <div className="h-2 rounded-full bg-gray-200">
                        <div
                            className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-center text-gray-600">Progress: {progress}%</p>
                </div>
            }
        />
    );
}

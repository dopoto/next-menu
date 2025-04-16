import { type ReactNode } from 'react';

export function PageSubtitle(props: { textColor?: string; children?: ReactNode }) {
    const { textColor = 'default', children } = props;
    return (
        <span
            className={`text-xl font-light tracking-tight ${textColor === 'default' ? 'text-gray-600 dark:text-gray-400' : textColor}`}
        >
            {children}
        </span>
    );
}

import { type ReactNode } from 'react';

export function PageSubtitle(props: { textSize?: 'sm' | 'xl'; textColor?: string; children?: ReactNode }) {
    const { textSize = 'xl', textColor = 'default', children } = props;
    return (
        <span
            className={`${textSize === 'sm' ? 'text-sm' : 'text-xl'} font-light tracking-tight ${
                textColor === 'default' ? 'text-gray-600 dark:text-gray-400' : textColor
            }`}
        >
            {children}
        </span>
    );
}

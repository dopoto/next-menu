import { Fragment, type ReactNode } from 'react';
import { Badge } from '~/components/ui/badge';

type Section = {
    title: string;
    content: ReactNode | string;
};

type Variant = 'preview' | 'confirmation' | 'neutral' | 'form';

const containerStyles: Record<Variant, string> = {
    preview: 'border-dashed border-gray-300',
    confirmation: 'border-green-700/20 bg-green-200/10',
    neutral: '',
    form: 'bg-background',
};

export function OverviewCard(props: {
    title?: string;
    subtitle?: string;
    sections: Section[];
    variant: Variant;
    className?: string;
}) {
    const containerStyle = containerStyles[props.variant];
    return (
        <div className={`${props.className} ${containerStyle} mb-4 flex flex-col rounded-xl border-1 p-4 text-xs`}>
            <div className="text-center text-sm font-semibold text-gray-500 uppercase">{props.title}</div>
            {props.subtitle && <div className="text-center text-sm text-gray-500">{props.subtitle}</div>}
            {props.sections.map((section) => (
                <Fragment key={section.title}>
                    {section.title && (
                        <Badge
                            variant={'outline'}
                            className="mt-5 mr-1 mb-1 w-[70px] gap-0 border-dashed border-gray-400"
                        >
                            {section.title}
                        </Badge>
                    )}
                    <div className="max-w-md">{section.content}</div>
                </Fragment>
            ))}
        </div>
    );
}

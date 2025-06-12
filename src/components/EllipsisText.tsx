import React, { useState } from 'react';

type EllipsisTextProps = {
    text: string;
    className?: string;
};

const EllipsisText: React.FC<EllipsisTextProps> = ({ text, className }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div
            className={className}
            style={{
                width: '100%',
                cursor: 'pointer',
                userSelect: 'text',
            }}
            onClick={() => setExpanded((prev) => !prev)}
            title={expanded ? undefined : text}
        >
            {expanded ? (
                <span>{text}</span>
            ) : (
                <span
                    style={{
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        width: '100%',
                    }}
                >
                    {text}
                </span>
            )}
        </div>
    );
};

export default EllipsisText;

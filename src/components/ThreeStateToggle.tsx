'use client';

import type React from 'react';

import { ChevronLeft, ChevronRight, Minus } from 'lucide-react';
import { cloneElement, isValidElement, useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '~/lib/utils';

type SelectedItem = 0 | 1 | 2;

interface ThreeStateToggleProps {
    leftIcon?: React.ReactNode;
    centerIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onStateChange?: (state: number) => void;
    defaultState?: SelectedItem;
    className?: string;
    size?: number;
}

export function ThreeStateToggle({
    leftIcon = <ChevronLeft className="h-5 w-5" />,
    centerIcon = <Minus className="h-5 w-5" />,
    rightIcon = <ChevronRight className="h-5 w-5" />,
    onStateChange,
    defaultState = 2,
    className,
    size = 48,
}: ThreeStateToggleProps) {
    const [selectedState, setSelectedState] = useState<0 | 1 | 2>(defaultState);
    const toggleRef = useRef<HTMLDivElement>(null);
    const startXRef = useRef<number | null>(null);

    // Calculate proportional sizes
    const padding = Math.max(4, Math.round(size * 0.08));
    const iconSize = Math.max(16, Math.round(size * 0.4));

    const handleStateChange = useCallback(
        (newState: SelectedItem) => {
            if (newState >= 0 && newState <= 2) {
                setSelectedState(newState);
                onStateChange?.(newState);
            }
        },
        [setSelectedState, onStateChange],
    );

    const swipeLeft = useCallback(() => {
        handleStateChange(Math.min((selectedState as number) - 1, 2) as SelectedItem);
    }, [handleStateChange, selectedState]);

    const swipeRight = useCallback(() => {
        handleStateChange(Math.min((selectedState as number) + 1, 2) as SelectedItem);
    }, [handleStateChange, selectedState]);

    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches?.[0]) {
            startXRef.current = e.touches[0].clientX;
        }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (startXRef.current === null || e.changedTouches.length === 0) return;

        const touch = e.changedTouches[0];
        if (!touch) return;
        const endX = touch.clientX;
        const diffX = endX - startXRef.current;

        // Determine swipe direction if the swipe is significant enough
        if (Math.abs(diffX) > 30) {
            if (diffX > 0) {
                swipeRight();
            } else {
                swipeLeft();
            }
        }

        startXRef.current = null;
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        startXRef.current = e.clientX;
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        if (startXRef.current === null) return;

        const diffX = e.clientX - startXRef.current;

        // Determine swipe direction if the swipe is significant enough
        if (Math.abs(diffX) > 30) {
            if (diffX > 0) {
                swipeRight();
            } else {
                swipeLeft();
            }
        }

        startXRef.current = null;
    }; // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (document.activeElement === toggleRef.current) {
                if (e.key === 'ArrowLeft') {
                    swipeLeft();
                    e.preventDefault();
                } else if (e.key === 'ArrowRight') {
                    swipeRight();
                    e.preventDefault();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedState, swipeLeft, swipeRight]);

    // Helper function to resize icons
    const resizeIcon = (icon: React.ReactNode) => {
        if (isValidElement(icon)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const iconProps: Record<string, any> = {};
            // Only add className if the element supports it
            if (icon.props && typeof icon.props === 'object' && 'className' in icon.props) {
                const className =
                    typeof icon.props === 'object' && icon.props !== null && 'className' in icon.props
                        ? (icon.props.className as string)?.replace(/w-\d+|h-\d+/g, '') || ''
                        : '';
                iconProps.className = cn(className, `h-${Math.round(iconSize / 4)} w-${Math.round(iconSize / 4)}`);
            }
            // Only add size if the element supports it
            if (icon.props && typeof icon.props === 'object' && 'size' in icon.props) {
                iconProps.size = iconSize;
            }
            return cloneElement(icon as React.ReactElement, iconProps);
        }
        return icon;
    };

    return (
        <div
            ref={toggleRef}
            className={cn('relative flex cursor-pointer select-none rounded-full bg-gray-100 shadow-inner', className)}
            style={{
                height: `${size}px`,
                width: `${size * 2.5}px`,
                padding: `${padding}px`,
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={(e) => startXRef.current !== null && handleMouseUp(e)}
            tabIndex={0}
            role="slider"
            aria-valuemin={0}
            aria-valuemax={2}
            aria-valuenow={selectedState}
            aria-valuetext={['Left', 'Center', 'Right'][selectedState]}
        >
            {/* Sliding indicator */}
            <div
                className="absolute rounded-full bg-white shadow-md transition-all duration-200"
                style={{
                    top: `${padding}px`,
                    height: `${size - padding * 2}px`,
                    width: `calc(100%/3 - ${padding}px)`,
                    left: `calc(${selectedState} * (100% - 100%/3 + ${padding / 2}px)/2)`,
                }}
            />

            {/* Left state */}
            <div
                className={cn(
                    'flex flex-1 items-center justify-center rounded-full transition-colors z-10',
                    selectedState === 0 ? 'text-gray-800' : 'text-gray-400',
                )}
                onClick={() => handleStateChange(0)}
            >
                {resizeIcon(leftIcon)}
                <span className="sr-only">Left state</span>
            </div>

            {/* Center state */}
            <div
                className={cn(
                    'flex flex-1 items-center justify-center rounded-full transition-colors z-10',
                    selectedState === 1 ? 'text-gray-800' : 'text-gray-400',
                )}
                onClick={() => handleStateChange(1)}
            >
                {resizeIcon(centerIcon)}
                <span className="sr-only">Center state</span>
            </div>

            {/* Right state */}
            <div
                className={cn(
                    'flex flex-1 items-center justify-center rounded-full transition-colors z-10',
                    selectedState === 2 ? 'text-gray-800' : 'text-gray-400',
                )}
                onClick={() => handleStateChange(2)}
            >
                {resizeIcon(rightIcon)}
                <span className="sr-only">Right state</span>
            </div>
        </div>
    );
}

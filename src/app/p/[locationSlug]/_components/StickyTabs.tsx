'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useTheme } from '~/components/ThemeProvider';

export interface Section {
    id: string;
    title: string;
    content: ReactNode;
}

export default function StickyTabs(props: { sections: Section[] }) {
    const { setTheme } = useTheme();

    useEffect(() => {
        setTheme('light');
    }, [setTheme]);

    const { sections } = props;

    const [activeTab, setActiveTab] = useState(sections[0]?.id ?? '');
    const [userScrolling, setUserScrolling] = useState(false);
    const [userSelected, setUserSelected] = useState<string | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const tabsRef = useRef<HTMLDivElement>(null);
    const userScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Set up intersection observer
    useEffect(() => {
        if (sections.length === 0) return;

        // Get the height of the tabs for offset calculation
        const tabsHeight = tabsRef.current?.offsetHeight ?? 50;

        // Clean up previous observer
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        // Create a map to store intersection ratios
        const sectionRatios = new Map<string, number>();

        // Options for the observer
        const options = {
            root: null, // viewport
            rootMargin: `-${tabsHeight}px 0px 0px 0px`, // Adjust for sticky header
            threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0], // Multiple thresholds for better accuracy
        };

        // Callback for the observer
        const callback: IntersectionObserverCallback = (entries) => {
            if (userScrolling) return;

            // Update the map with new intersection ratios
            entries.forEach((entry) => {
                sectionRatios.set(entry.target.id, entry.intersectionRatio);
            });

            // If user explicitly selected a section and it's still visible, prioritize it
            if (userSelected && sectionRatios.get(userSelected) && sectionRatios.get(userSelected)! > 0.1) {
                setActiveTab(userSelected);
                return;
            }

            // Find the section with the highest intersection ratio
            let maxRatio = 0;
            let maxSection = activeTab;

            // Special handling for when all sections are visible
            const allSectionsVisible = [...sectionRatios.values()].every((ratio) => ratio > 0.5);

            if (allSectionsVisible) {
                // If all sections are visible, don't change the active tab unless explicitly clicked
                return;
            }

            sectionRatios.forEach((ratio, sectionId) => {
                if (ratio > maxRatio) {
                    maxRatio = ratio;
                    maxSection = sectionId;
                }
            });

            // Only update if we have a significant intersection
            if (maxRatio > 0.1) {
                setActiveTab(maxSection);
            }
        };

        // Create and set up the observer
        observerRef.current = new IntersectionObserver(callback, options);

        // Observe all sections
        sections.forEach((section) => {
            const element = document.getElementById(section.id);
            if (element) {
                observerRef.current?.observe(element);
            }
        });

        return () => {
            observerRef.current?.disconnect();
            if (userScrollTimeoutRef.current) {
                clearTimeout(userScrollTimeoutRef.current);
            }
        };
    }, [sections, activeTab, userScrolling, userSelected]);

    // Handle manual tab clicks
    const scrollToSection = (id: string) => {
        // Clear any existing timeout
        if (userScrollTimeoutRef.current) {
            clearTimeout(userScrollTimeoutRef.current);
        }

        setUserScrolling(true);
        setActiveTab(id);
        setUserSelected(id); // Mark this section as explicitly selected by user

        const element = document.getElementById(id);
        const tabsHeight = tabsRef.current?.offsetHeight ?? 50;

        if (element) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - tabsHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });

            // Re-enable intersection observer after scrolling completes
            userScrollTimeoutRef.current = setTimeout(() => {
                setUserScrolling(false);

                // Clear user selection after a longer period
                // This allows the selection to "stick" for a while
                setTimeout(() => {
                    setUserSelected(null);
                }, 5000);
            }, 1000); // Wait for scroll animation to complete
        } else {
            setUserScrolling(false);
        }
    };

    return (
        <div className="mt-4">
            {/* Sticky tabs */}
            {sections.length > 1 && <div ref={tabsRef} className="sticky top-0 z-10   pb-2 pt-2">
                <div className="flex space-x-2 overflow-x-auto hide-scrollbar   max-w-6xl mx-auto">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => scrollToSection(section.id)}
                            className={`px-4 py-2 rounded-md whitespace-nowrap text-sm font-medium transition-colors ${activeTab === section.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                }`}
                        >
                            {section.title}
                        </button>
                    ))}
                </div>
            </div>}

            {/* Content sections */}
            <div className="max-w-6xl mx-auto">
                {sections.map((section) => (
                    <section key={section.id} id={section.id} className="py-3">
                        {section.content}
                    </section>
                ))}
            </div>
        </div>
    );
}

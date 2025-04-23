'use client';

import {
    AudioWaveform,
    BookOpen,
    Bot,
    Command,
    Frame,
    GalleryVerticalEnd,
    Map,
    PanelLeft,
    PieChart,
    Settings2,
    SquareTerminal,
} from 'lucide-react';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

// This is sample data.
const data = {
    user: {
        name: 'shadcn',
        email: 'm@example.com',
        avatar: '/avatars/shadcn.jpg',
    },
    teams: [
        {
            name: 'Acme Inc',
            logo: GalleryVerticalEnd,
            plan: 'Enterprise',
        },
        {
            name: 'Acme Corp.',
            logo: AudioWaveform,
            plan: 'Startup',
        },
        {
            name: 'Evil Corp.',
            logo: Command,
            plan: 'Free',
        },
    ],
    navMain: [
        {
            title: 'Playground',
            url: '#',
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: 'History',
                    url: '#',
                },
                {
                    title: 'Starred',
                    url: '#',
                },
                {
                    title: 'Settings',
                    url: '#',
                },
            ],
        },
        {
            title: 'Models',
            url: '#',
            icon: Bot,
            items: [
                {
                    title: 'Genesis',
                    url: '#',
                },
                {
                    title: 'Explorer',
                    url: '#',
                },
                {
                    title: 'Quantum',
                    url: '#',
                },
            ],
        },
        {
            title: 'Documentation',
            url: '#',
            icon: BookOpen,
            items: [
                {
                    title: 'Introduction',
                    url: '#',
                },
                {
                    title: 'Get Started',
                    url: '#',
                },
                {
                    title: 'Tutorials',
                    url: '#',
                },
                {
                    title: 'Changelog',
                    url: '#',
                },
            ],
        },
        {
            title: 'Settings',
            url: '#',
            icon: Settings2,
            items: [
                {
                    title: 'General',
                    url: '#',
                },
                {
                    title: 'Team',
                    url: '#',
                },
                {
                    title: 'Billing',
                    url: '#',
                },
                {
                    title: 'Limits',
                    url: '#',
                },
            ],
        },
    ],
    projects: [
        {
            name: 'Design Engineering',
            url: '#',
            icon: Frame,
        },
        {
            name: 'Sales & Marketing',
            url: '#',
            icon: PieChart,
        },
        {
            name: 'Travel',
            url: '#',
            icon: Map,
        },
    ],
};

interface CustomSidebarProps {
    defaultExpanded?: boolean;
    children: React.ReactNode;
}

export function CustomSidebar({ defaultExpanded = false, children }: CustomSidebarProps) {
    const [expanded, setExpanded] = useState(defaultExpanded);

    // Update cookie when sidebar state changes
    const toggleSidebar = () => {
        const newState = !expanded;
        document.cookie = `sidebar_state=${newState}; path=/; max-age=31536000`; // 1 year
        setExpanded(newState);
    };

    // Set initial state from cookie on client side
    useEffect(() => {
        const cookieValue = document.cookie
            .split('; ')
            .find((row) => row.startsWith('sidebar_state='))
            ?.split('=')[1];

        if (cookieValue !== undefined) {
            setExpanded(cookieValue === 'true');
        }
    }, []);

    return (
        <div className="flex h-screen w-full overflow-hidden">
            {/* Custom sidebar that's always visible */}
            <div
                className={cn(
                    'flex h-full flex-col bg-sidebar text-sidebar-foreground border-r transition-all duration-300',
                    expanded ? 'w-64' : 'w-16',
                )}
            >
                {/* Header */}
                <div className="flex flex-col gap-2 p-2">
                    {expanded ? (
                        <>team swit</>
                    ) : (
                        <div className="flex justify-center p-2">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                {data.teams[0]?.logo &&
                                    React.createElement(data.teams[0].logo, { className: 'size-4' })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto p-2">main</div>

                {/* Footer */}
                <div className="flex flex-col gap-2 p-2">user</div>
            </div>

            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-auto">
                <header className="flex h-16 shrink-0 items-center gap-2 border-b">
                    <div className="flex items-center gap-2 px-4">
                        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8">
                            <PanelLeft className="h-4 w-4" />
                            <span className="sr-only">Toggle Sidebar</span>
                        </Button>
                        {children}
                    </div>
                </header>
                <div className="flex-1 p-4">{/* Page content goes here */}</div>
            </div>
        </div>
    );
}

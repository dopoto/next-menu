import { SignedIn, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { type ReactNode } from 'react';
import { AppVersion } from '~/components/AppVersion';
import { PageSubtitle } from '~/components/PageSubtitle';
import { PageTitle } from '~/components/PageTitle';
import SvgIcon from '~/components/SvgIcons';
import { ThemeSwitch } from '~/components/ThemeSwitch';
import { ROUTES } from '~/lib/routes';

export function SplitScreenContainer(props: {
    title: string;
    subtitle: string;
    mainComponent: ReactNode;
    secondaryComponent?: ReactNode;
    sideHeroComponent?: ReactNode;
}) {
    return (
        <div className="flex min-h-full w-full min-w-0 flex-auto flex-col bg-amber-50 sm:flex-row sm:justify-center dark:bg-[#202027]">
            <div
                id="mainContent"
                className="relative flex h-full w-full flex-col flex-nowrap gap-3 px-4 py-2 sm:h-auto sm:w-[500px] sm:px-6 xl:w-[750px] xl:px-36"
            >
                <div className="py-6">
                    <nav className="flex w-full">
                        <Link href={ROUTES.my}>
                            <SvgIcon kind="logo" size={'12'} className="fill-black dark:fill-white" />
                        </Link>
                        <SignedIn>
                            <div className="ml-auto flex items-end">
                                <UserButton
                                    userProfileMode="navigation"
                                    userProfileUrl="/my"
                                    appearance={{
                                        elements: {
                                            userButtonAvatarBox: {
                                                width: '48px',
                                                height: '48px',
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </SignedIn>
                    </nav>
                </div>
                <div className="flex flex-col flex-nowrap">
                    <PageTitle>{props.title}</PageTitle>
                    <PageSubtitle>{props.subtitle}</PageSubtitle>
                </div>

                {props.secondaryComponent}

                {props.mainComponent}

                <footer className="mt-auto flex flex-row pt-6 text-xs text-gray-400">
                    <AppVersion />
                    <div className="mt-auto ml-auto">
                        <ThemeSwitch />
                    </div>
                </footer>
            </div>
            <div className="relative hidden h-auto min-h-screen flex-auto items-center justify-center overflow-hidden bg-blue-900 p-16 lg:flex lg:px-28 dark:bg-blue-950">
                <svg
                    className="pointer-events-none absolute inset-0"
                    viewBox="0 0 960 540"
                    width="100%"
                    height="100%"
                    preserveAspectRatio="xMidYMax slice"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g className="opacity-5" fill="none" stroke="currentColor" strokeWidth="100">
                        <circle r="234" cx="196" cy="23"></circle>
                        <circle r="234" cx="790" cy="491"></circle>
                    </g>
                </svg>
                {props.sideHeroComponent}
            </div>
        </div>
    );
}

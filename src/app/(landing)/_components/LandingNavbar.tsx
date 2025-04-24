'use client';

import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import SvgIcon from '~/components/SvgIcons';
import { Button } from '~/components/ui/button';
import { type LandingPageNavItem } from '~/domain/nav-items';
import { ROUTES } from '~/lib/routes';

export function LandingNavbar(props: { navItems: LandingPageNavItem[] }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <nav className="bg-background fixed z-10 w-full">
            <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                    <div className="flex items-center">
                        <div className="flex flex-shrink-0 items-center">
                            <Link href={ROUTES.home}>
                                <SvgIcon kind="logo" size={'12'} />
                            </Link>
                        </div>
                        <div className="hidden md:ml-6 md:flex md:space-x-8">
                            {props.navItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="text-l inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                >
                                    {item.name}
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="hidden items-center gap-2 md:flex">
                        <SignedOut>
                            <SignInButton>
                                <Button variant={'secondary'}>Log in</Button>
                            </SignInButton>
                            <Link href={ROUTES.signUp}>
                                <Button>Sign up</Button>
                            </Link>
                        </SignedOut>
                        <SignedIn>
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
                        </SignedIn>
                    </div>
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            type="button"
                            className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                        >
                            {isMenuOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="space-y-1 pt-2 pb-3">
                        {props.navItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="text-l block border-l-4 border-transparent py-2 pr-4 pl-3 font-light tracking-tight text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>
                    <div className="border-b border-gray-200 pt-4 pb-3">
                        <div className="flex items-end gap-2 px-4">
                            <SignedOut>
                                <SignInButton>
                                    <Button variant={'secondary'}>Log in</Button>
                                </SignInButton>
                                <SignUpButton>
                                    <Button>Sign up</Button>
                                </SignUpButton>
                            </SignedOut>
                            <SignedIn>
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
                            </SignedIn>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

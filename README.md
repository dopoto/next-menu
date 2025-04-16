# Next Menu

A sample Next.js application that allows restaurant and bar owners to generate QR-powered digital menus.

## Stack

- [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.
- Next.js 15 App router
- shadcn
- Drizzle
- Clerk
- Sentry integration

## Features

### Onboarding process

Users sign up with Clerk, create an organization and go through the initial setup of their account (they must add a location to complete the onboarding).

If a non-free plan is selected, users need to go through an additional 'Pay with Stripe' step during onboarding.

### Dashboard

Signed in users have access to a dashboard where they can manage their location and menus.

## Demo

[https://next-menu-omega.vercel.app](https://next-menu-omega.vercel.app)

"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider, useTheme } from "./ThemeProvider";
import { dark } from "@clerk/themes";
import { useEffect, useState } from "react";

interface ProviderConfig<P> {
  Component: React.ComponentType<P>;
  shouldRender?: boolean;
  props?: P;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function composeProviders<T extends Array<ProviderConfig<any>>>(configs: T) {
  return ({ children }: { children: React.ReactNode }) =>
    configs.reduceRight((acc, { Component, shouldRender, props }) => {
      if (shouldRender === false) {
        return acc;
      }
      return <Component {...props}>{acc}</Component>;
    }, children);
}

function ClerkThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const [clerkTheme, setClerkTheme] = useState(
    theme === "dark" ? dark : undefined,
  );

  useEffect(() => {
    setClerkTheme(theme === "dark" ? dark : undefined);
  }, [theme]);

  return (
    <ClerkProvider appearance={{ baseTheme: clerkTheme }} afterSignOutUrl="/" >
      {children}
    </ClerkProvider>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const AppProviders = composeProviders([
    { Component: ThemeProvider },
    { Component: ClerkThemeWrapper },
  ]);

  return <AppProviders>{children}</AppProviders>;
}

import { type ReactNode } from "react";

export type OnboardingStep = {
  id: string;
  isActive: boolean;
  icon: ReactNode;
  title: string | ReactNode;
  subtitle?: string | ReactNode;
};

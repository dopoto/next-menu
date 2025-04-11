import { type Meta, type StoryObj } from "@storybook/react";
import React from "react";
import { PriceTierCard } from "~/app/_components/PriceTierCard";
import { priceTiers } from "~/app/_domain/price-tiers";
import { Button } from "~/components/ui/button";

const meta: Meta<typeof PriceTierCard> = {
  title: "Components/PriceTierCard",
  component: PriceTierCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof PriceTierCard>;

const parameters = {
  nextjs: {
    appDirectory: true,
    router: {
      pathname: "/profile/[id]",
      asPath: "/profile/1",
      query: {
        id: "1",
      },
    },
  },
};

export const Default: Story = {
  parameters,
  args: {
    tier: priceTiers.start,
  },
};

export const WithCardCustomizations: Story = {
  parameters,
  args: {
    tier: priceTiers.start,
    cardCustomizations: {
      containerStyle: " ",
      badgeStyle: "bg-red-700",
      badgeText: "Our most popular plan!",
    },
  },
};

export const WithExceededFeatures: Story = {
  parameters,
  args: {
    tier: priceTiers.start,
    exceededFeatures: [
      {
        id: "menus",
        planQuota: 1,
        used: 2,
        available: 0,
        candidateQuota: 2,
      },
    ],
  },
};

export const WithFooterCta: Story = {
  parameters,
  args: {
    tier: priceTiers.start,
    exceededFeatures: [
      {
        id: "menus",
        planQuota: 1,
        used: 1,
        available: 0,
        candidateQuota: 2,
      },
    ],
    footerCta: (
      <Button className="w-full" variant={"default"}>
        Do something
      </Button>
    ),
  },
};

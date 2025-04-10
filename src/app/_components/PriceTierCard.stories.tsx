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
        used: 1,
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

// import React from "react";
// import { Meta, Story } from "@storybook/react";
// import { PriceTierCard, getCurrentPlanCardCustomizations } from "./PriceTierCard";
// import { type PriceTier } from "../_domain/price-tiers";

// export default {
//   title: "Components/PriceTierCard",
//   component: PriceTierCard,
// } as Meta;

// const Template: Story<React.ComponentProps<typeof PriceTierCard>> = (args) => (
//   <PriceTierCard {...args} />
// );

// export const Default = Template.bind({});
// Default.args = {
//   tier: {
//     name: "Basic Plan",
//     description: "A basic plan for starters.",
//     monthlyUsdPrice: 10,
//     features: [
//       { id: "feature1", quota: 10 },
//       { id: "feature2", quota: 5 },
//     ],
//     flags: [{ id: "flag1", isEnabled: true }],
//   } as PriceTier,
// };

// export const CurrentPlan = Template.bind({});
// CurrentPlan.args = {
//   tier: {
//     name: "Pro Plan",
//     description: "The plan you are currently subscribed to.",
//     monthlyUsdPrice: 20,
//     features: [
//       { id: "feature1", quota: 20 },
//       { id: "feature2", quota: 10 },
//     ],
//     flags: [{ id: "flag1", isEnabled: true }],
//   } as PriceTier,
//   cardCustomizations: getCurrentPlanCardCustomizations(),
// };

// export const ExceededPlan = Template.bind({});
// ExceededPlan.args = {
//   tier: {
//     name: "Enterprise Plan",
//     description: "A plan exceeding your current usage.",
//     monthlyUsdPrice: 50,
//     features: [
//       { id: "feature1", quota: 50 },
//       { id: "feature2", quota: 25 },
//     ],
//     flags: [{ id: "flag1", isEnabled: true }],
//   } as PriceTier,
//   exceededFeatures: [
//     { id: "feature1", used: 60 },
//     { id: "feature2", used: 30 },
//   ],
// };

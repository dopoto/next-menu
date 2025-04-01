import type { Meta, StoryObj } from "@storybook/react";
import { ErrorCard } from "~/app/_components/ErrorCard";
import { Labeled } from "~/app/_components/Labeled";

// const meta = {
//   title: "Labeled",
//   component: Labeled,
//   parameters: {
//     layout: "centered",
//   },
//   tags: ["autodocs"],
// } satisfies Meta<typeof Labeled>;

const meta: Meta<typeof Labeled> = {
  component: Labeled,
  parameters: {
    layout: "centered",
  },
};
export default meta;

type Story = StoryObj<typeof Labeled>;

export const Default: Story = {
  args: {
    label: "Some label",
    text: "Some value",
  },
};
